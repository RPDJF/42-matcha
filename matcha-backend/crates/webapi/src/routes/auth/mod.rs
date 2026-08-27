/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:06:06 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/27 04:25:42 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

pub mod login;
pub mod register;

use axum::{
	Router,
	routing::{delete, get, patch, post, put},
};

use crate::DatabaseConnection;

/// Regosters every GET route for /auth.
pub fn get_routes() -> Router<DatabaseConnection>
{
	Router::new()
}
/// Regosters every POST route for /auth.
pub fn post_routes() -> Router<DatabaseConnection>
{
	Router::new()
		.route("/register", post(register::register))
		.route("/login", post(login::login))
}
