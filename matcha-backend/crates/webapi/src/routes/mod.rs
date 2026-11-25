/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:06:06 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/24 23:38:48 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

mod auth;
mod users;

use axum::{
	Router,
	routing::{delete, get, patch, post, put},
};
use userlib::caches::UserCache;

/// Collects every get route and nests it accordingly. Returns a router.
/// Used only in debug builds.
#[cfg(debug_assertions)]
pub fn get_routes() -> Router<UserCache>
{
	Router::new()
		.route("/list", get(users::get_users))
		.nest("/auth", auth::get_routes())
}

/// Collects every get route and nests it accordingly. Returns a router.
/// Used only in release builds.
#[cfg(not(debug_assertions))]
pub fn get_routes() -> Router<UserCache>
{
	Router::new().nest("/auth", auth::get_routes())
}

/// Collects every post route and nests it accordingly. Returns a router.
pub fn post_routes() -> Router<UserCache>
{
	Router::new().nest("/auth", auth::post_routes())
}
