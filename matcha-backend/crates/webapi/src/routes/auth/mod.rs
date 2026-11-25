/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:06:06 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 01:17:21 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

pub mod login;
pub mod register;
pub mod validate;

use axum::{
	Router,
	routing::{delete, get, patch, post, put},
};
use userlib::caches::UserCache;

/// Regosters every GET route for /auth.
pub fn get_routes() -> Router<UserCache>
{
	Router::new()
}
/// Regosters every POST route for /auth.
pub fn post_routes() -> Router<UserCache>
{
	Router::new()
		.route("/register", post(register::register))
		.route("/validate", post(validate::validate))
		.route("/login", post(login::login))
}
