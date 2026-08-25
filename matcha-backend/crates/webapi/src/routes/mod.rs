/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:06:06 by fclivaz           #+#    #+#             */
/*   Updated: 2026/06/21 16:30:54 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

pub mod login;
pub mod users;

use axum::{
	Router,
	routing::{delete, get, patch, post, put},
};

pub fn get_routes() -> Router {
	Router::new().route("/list", get(users::get_users))
}
pub fn post_routes() -> Router {
	Router::new().route("/login", post(login::login))
}
