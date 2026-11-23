/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lib.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/11/23 02:33:34 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/23 04:25:39 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use std::{
	collections::HashMap,
	hash::Hash,
	sync::{Arc, RwLock},
	time::{SystemTime, UNIX_EPOCH},
};

struct LookupTable<T>
{
	pub data: T,
	//	pub crttime: u64,
	pub exptime: u64,
}

#[derive(Default, Clone)]
pub struct DataCache<K, V>
{
	data: Arc<RwLock<HashMap<K, LookupTable<V>>>>,
}

pub struct Seconds(pub u64);

// TODO:	Self-deleting items after exptime + 30s have passed.
//			Change error types to something a little better...

#[allow(clippy::cast_possible_truncation)]
#[allow(clippy::arithmetic_side_effects)]
#[allow(clippy::as_conversions)]
impl<K: Eq + Hash + Clone, V: Clone> DataCache<K, V>
{
	#[must_use]
	pub fn new() -> Self
	{
		Self {
			data: Arc::new(RwLock::new(HashMap::new())),
		}
	}

	pub fn get(&self, key: &K) -> Result<V, &'static str>
	{
		let rlock = self.data.read();

		match rlock {
			Ok(ref map) => {
				if let Some(result) = map.get(key) {
					if SystemTime::now()
						.duration_since(UNIX_EPOCH)
						.unwrap_or_default()
						.as_millis() as u64
						> result.exptime
					{
						return Err("TIME TOO BIG");
					}
					return Ok(result.data.to_owned());
				}
			}
			Err(_) => return Err("Error reading map, please retry"),
		}
		drop(rlock);
		Err("Key not found")
	}

	pub fn insert(&self, key: &K, value: &V, expire_in: &Seconds) -> Result<(), &'static str>
	{
		let stamp = SystemTime::now()
			.duration_since(UNIX_EPOCH)
			.unwrap_or_default()
			.as_millis() as u64;

		let new_table = LookupTable {
			data: value.to_owned(),
			//	crttime: stamp,
			exptime: stamp + (expire_in.0 * 1000),
		};

		let wlock = self.data.write();

		wlock.map_or(Err("Error reading map, please retry"), |mut map| {
			map.insert(key.to_owned(), new_table);
			Ok(())
		})
	}
}

#[cfg(test)]
mod tests;
