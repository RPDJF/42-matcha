/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/15 19:59:50 by fclivaz           #+#    #+#             */
/*   Updated: 2026/06/17 20:50:05 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

pub mod auth;
pub mod users;

use axum::{
	Router,
	routing::{delete, get, patch, post, put},
};

pub fn get_routes() -> Router {
	Router::new().route("/users", get(users::list))
}
pub fn post_routes() -> Router {
	Router::new().route("/login", post(auth::login))
}
