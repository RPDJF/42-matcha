/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lib.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:48:21 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/25 19:33:50 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use uuid::Uuid;
pub mod creation;
pub mod errors;
pub mod models;
use crate::models::business::{Genders, Location, MatchaUser, Role};

/// Returns a complete list of every MatchaUser.
/// Used only in debug.
#[cfg(debug_assertions)]
pub fn list_users() -> Vec<MatchaUser>
{
	vec![
		MatchaUser::new(
			Uuid::new_v4(),
			"John",
			"Matcha",
			18239128,
			69,
			"insert cool picture link here",
			Genders::Backend,
			3,
			&[Genders::Frontend],
			12,
			&[],
			&["well", "not a whole lot really", "just some games i guess"],
			"Hello my name is John and this is my Matcha.",
			Role::Administrator,
			"BUSSIgny",
			Location {
				longitude: 0.25,
				latitude: 3.21,
			},
		),
		MatchaUser::new(
			Uuid::new_v4(),
			"Jane",
			"Frontend",
			420,
			12,
			"picture link or whatever",
			Genders::Fullstack,
			1919,
			&[Genders::Backend],
			5,
			&[],
			&["c#", "brainf**k", "tadc"],
			"I am severely underage apparently but who cares.",
			Role::User,
			"in the depths of atlantis",
			Location {
				longitude: 129837198230.212983912835,
				latitude: 3192831283.292813109231,
			},
		),
		MatchaUser::new(
			Uuid::new_v4(),
			"jax",
			"jax",
			47,
			1337,
			"insert dead picture here",
			Genders::Frontend,
			-1,
			&[Genders::Frontend, Genders::Backend, Genders::Fullstack],
			-1,
			&[],
			&[
				"jax",
				"like its just jax",
				"what else are you expecting bruh",
			],
			"dead as fuhhhh",
			Role::User,
			"6 feet under",
			Location {
				longitude: 5.1283712,
				latitude: -321111111111.21,
			},
		),
	]
}

#[cfg(test)]
mod tests
{
	use super::*;

	#[test]
	fn it_works() {}
}
