/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/15 20:41:01 by fclivaz           #+#    #+#             */
/*   Updated: 2026/06/17 21:26:00 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use axum::{Json, http::StatusCode};
use serde::{Deserialize, Serialize};

use crate::models::user::Location;

#[derive(Serialize, Deserialize)]
pub struct Succ {
	cess: String,
}

pub async fn login(payload: Json<Location>) -> (StatusCode, Json<Succ>) {
	(
		StatusCode::OK,
		Json(Succ {
			cess: format!(
				"congrats you are logged in bruh: {} {}",
				payload.latitude, payload.longitude
			),
		}),
	)
}
