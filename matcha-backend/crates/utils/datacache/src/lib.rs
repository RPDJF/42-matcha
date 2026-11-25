/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lib.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/11/23 02:33:34 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 01:33:36 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use std::{
	collections::HashMap,
	hash::Hash,
	sync::{Arc, RwLock},
	time::{SystemTime, UNIX_EPOCH},
};

use crate::errors::DatacacheError;

pub mod errors;

///	Item entry in cache.
struct CacheEntry<T>
{
	/// The item itself.
	pub data: T,
	///	Commented for now but left in in case it becomes useful.
	//	pub crttime: u64,
	///	Pre-computed expiry time.
	pub exptime: u64,
}

///	The datacache itself, a Hash Map of Key-Value pairs.
///	Hidden behind an Atomic Reference Counter for longevity, and
///	a `ReadWrite` Lock for concurrency.
#[derive(Default, Clone)]
pub struct DataCache<K, V>
{
	data: Arc<RwLock<HashMap<K, CacheEntry<V>>>>,
}

///	Newtype for Seconds in order to make sure the user is passing in Seconds,
///	in case the Datacache ends up supporting other time frames (Milis, Hours)
pub struct Seconds(pub u64);

// TODO:	Self-deleting items after exptime + 30s have passed.

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

	/// Retrieves an item from the datacache.
	/// # Errors
	/// Returns a `DatacacheError` containing a desctiption of the error that
	/// occurred.
	pub fn get(&self, key: &K) -> Result<V, DatacacheError>
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
						return Err(DatacacheError::EntryExpired);
					}
					return Ok(result.data.to_owned());
				}
			}
			Err(_) => return Err(DatacacheError::LockError),
		}
		drop(rlock);
		Err(DatacacheError::EntryNotFound)
	}

	/// Inserts an item into the datacache.
	/// # Errors
	/// Returns a `DatacacheError` containing a desctiption of the error that
	/// occurred.
	pub fn insert(&self, key: &K, value: &V, expire_in: &Seconds) -> Result<(), DatacacheError>
	{
		let stamp = SystemTime::now()
			.duration_since(UNIX_EPOCH)
			.unwrap_or_default()
			.as_millis() as u64;

		let new_table = CacheEntry {
			data: value.to_owned(),
			//	crttime: stamp,
			exptime: stamp + (expire_in.0 * 1000),
		};

		let wlock = self.data.write();

		wlock.map_or(Err(DatacacheError::LockError), |mut map| {
			map.insert(key.to_owned(), new_table);
			Ok(())
		})
	}
}

#[cfg(test)]
mod tests;
