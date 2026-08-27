/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:06:06 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/27 04:51:43 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

pub mod auth;
pub mod users;

use axum::{
	Router,
	routing::{delete, get, patch, post, put},
};
use sea_orm::DatabaseConnection;

/// Collects every get route and nests it accordingly. Returns a router.
/// Used only in debug builds.
#[cfg(debug_assertions)]
pub fn get_routes() -> Router<DatabaseConnection>
{
	Router::new()
		.route("/list", get(users::get_users))
		.nest("/auth", auth::get_routes())
}

/// Collects every get route and nests it accordingly. Returns a router.
/// Used only in release builds.
#[cfg(not(debug_assertions))]
pub fn get_routes() -> Router<DatabaseConnection>
{
	Router::new().nest("/auth", auth::get_routes())
}

/// Collects every post route and nests it accordingly. Returns a router.
pub fn post_routes() -> Router<DatabaseConnection>
{
	Router::new().nest("/auth", auth::post_routes())
}
