/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/15 20:24:40 by fclivaz           #+#    #+#             */
/*   Updated: 2026/06/17 21:22:42 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub enum Genders {
	Male,
	Female,
	Unspecified,
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

impl DBUser {
	fn convert_vec(interests: &Vec<&str>) -> Vec<String> {
		let mut v = Vec::new();
		for item in interests {
			v.push(item.to_string());
		}
		v
	}

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
			interests: DBUser::convert_vec(&interests),
			location: geoloc,
		}
	}
}
