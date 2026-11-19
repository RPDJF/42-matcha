/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.rs                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:30:10 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/20 00:10:19 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use axum::Json;
use business::models::business::Location;
use userlib::errors::ErrorDetails;

use crate::globals::{AdditionResult, HTTPResponse};

/// Logs a user in.
/// Returns a JWT if the login is successful.
/// Well, at least it should. This is mock code for now.
pub async fn login(
	Json(payload): Json<Location>,
) -> Json<HTTPResponse<AdditionResult, ErrorDetails>>
{
	let fuh = AdditionResult {
		message: format!(
			"Added {} to {} = {}",
			payload.latitude,
			payload.longitude,
			payload.longitude + payload.latitude
		),
	};
	Json(HTTPResponse::new(fuh, "login"))
}
