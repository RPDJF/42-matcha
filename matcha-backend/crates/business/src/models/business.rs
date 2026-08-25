/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   business.rs                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 17:34:34 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/25 18:41:17 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// The available "Genders" to choose from.
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum Genders
{
	Frontend,
	Backend,
	Fullstack,
}

/// Defines if the user has administrator perms over the website.
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum Role
{
	User,
	Administrator,
}

/// Location on the planet as longitude and latitude.
#[derive(Serialize, Deserialize, Clone)]
pub struct Location
{
	pub longitude: f32,
	pub latitude: f32,
}

/// Defines a picture that is downloadable.
#[derive(Serialize, Deserialize, Clone)]
pub struct Picture
{
	/// The UUID of the picture.
	pub id: String,
	/// The GET-able URL of the picture.
	pub url: String,
}

/// Matcha MatchaUser. Cross-referenced with User.
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MatchaUser
{
	/// The user's UUID.
	uuid: Uuid,
	/// The user's first name.
	first_name: String,
	/// The user's last name.
	last_name: String,
	/// The user's birthday, in unix time miliseconds.
	birthday: i64,
	/// The user's age.
	age: u32,
	/// The user's avatar, downloadable URL.
	avatar: String,
	/// The user's "Gender".
	gender: Genders,
	/// The last time the user was online, in unix time miliseconds.
	last_alive: i64,
	/// The people the user is interested in.
	interested_in: Vec<Genders>,
	/// The user's rating.
	rating: i32,
	/// The user's uploaded pictures.
	pictures: Vec<Picture>,
	/// The user's hobbies.
	hobbies: Vec<String>,
	/// The user's biography.
	biography: String,
	/// The user's role.
	role: Role,
	/// The user's city in which they live.
	city: String,
	/// The user's geographical location.
	location: Location,
}

impl MatchaUser
{
	pub fn new(
		uuid: Uuid,
		first_name: &str,
		last_name: &str,
		birthday: i64,
		age: u32,
		avatar: &str,
		gender: Genders,
		last_alive: i64,
		interested_in: &[Genders],
		rating: i32,
		pictures: &[Picture],
		hobbies: &[&str],
		biography: &str,
		role: Role,
		city: &str,
		location: Location,
	) -> MatchaUser
	{
		MatchaUser {
			uuid: uuid.clone(),
			first_name: first_name.to_string(),
			last_name: last_name.to_string(),
			birthday: birthday,
			age: age,
			avatar: avatar.to_string(),
			gender: gender,
			last_alive: last_alive,
			interested_in: interested_in.to_vec(),
			rating: rating,
			pictures: pictures.to_vec(),
			hobbies: hobbies.iter().map(|x| x.to_string()).collect(),
			biography: biography.to_string(),
			role: role,
			city: city.to_string(),
			location: location,
		}
	}
}
