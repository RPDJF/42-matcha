/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:06:06 by fclivaz           #+#    #+#             */
/*   Updated: 2026/07/08 19:40:39 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

pub mod login;
pub mod register;

use axum::{
	Router,
	routing::{delete, get, patch, post, put},
};

/// Regosters every GET route for /auth.
pub fn get_routes() -> Router {
	Router::new()
}
/// Regosters every POST route for /auth.
pub fn post_routes() -> Router {
	Router::new()
		.route("/register", post(register::register))
		.route("/login", post(login::login))
}
