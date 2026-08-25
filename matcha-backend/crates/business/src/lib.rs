/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lib.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:48:21 by fclivaz           #+#    #+#             */
/*   Updated: 2026/06/21 16:48:22 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

pub fn add(left: f32, right: f32) -> f32 {
	left + right
}

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub enum Genders {
	Frontend,
	Backend,
	Fullstack,
}

#[derive(Serialize, Deserialize)]
pub struct Location {
	pub longitude: f32,
	pub latitude: f32,
}

#[derive(Serialize)]
pub struct DBUser {
	name: String,
	uuid: String,
	gender: Genders,
	age: u32,
	birthday: i32,
	interests: Vec<String>,
	location: Location,
}

pub fn list_users() -> Vec<DBUser> {
	vec![
		DBUser::new(
			"John Matcha",
			Genders::Backend,
			69,
			18239128,
			vec!["well", "not a whole lot really", "just some games i guess"],
			Location {
				longitude: 0.25,
				latitude: 3.21,
			},
		),
		DBUser::new(
			"Jane Frontend",
			Genders::Fullstack,
			420,
			12,
			vec!["c#", "brainf**k", "tadc"],
			Location {
				longitude: 129837198230.212983912835,
				latitude: 3192831283.292813109231,
			},
		),
		DBUser::new(
			"jax",
			Genders::Frontend,
			47,
			1337,
			vec![
				"jax",
				"like its just jax",
				"what else are you expecting bruh",
			],
			Location {
				longitude: 5.1283712,
				latitude: -321111111111.21,
			},
		),
	]
}

impl DBUser {
	pub fn new(
		name: &str,
		gender: Genders,
		age: u32,
		birthday: i32,
		interests: Vec<&str>,
		geoloc: Location,
	) -> DBUser {
		DBUser {
			name: name.to_string(),
			uuid: Uuid::new_v4().to_string(),
			gender: gender,
			age: age,
			birthday: birthday,
			interests: interests.iter().map(|x| x.to_string()).collect(),
			location: geoloc,
		}
	}
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn it_works() {
		let result = add(2.0, 2.0);
		assert_eq!(result, 4.0);
	}
}
