/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.rs                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/15 20:17:42 by fclivaz           #+#    #+#             */
/*   Updated: 2026/06/17 20:40:29 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use axum::{
	Json,
	routing::{MethodRouter, get},
};

use crate::models::user::{DBUser, Genders, Location};

pub async fn list() -> Json<DBUser> {
	Json(DBUser::new(
		"John Matcha",
		Genders::Male,
		69,
		18239128,
		vec!["well", "not a whole lot really", "just some games i guess"],
		Location {
			longitude: 0.25,
			latitude: 3.21,
		},
	))
}
