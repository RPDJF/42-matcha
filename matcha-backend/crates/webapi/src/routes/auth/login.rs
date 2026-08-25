/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.rs                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:30:10 by fclivaz           #+#    #+#             */
/*   Updated: 2026/07/11 01:56:48 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use axum::Json;
use business::models::business::Location;

use crate::globals::{AdditionResult, HTTPResponse, ResponseData};

/// Logs a user in.
/// Returns a JWT if the login is successful.
/// Well, at least it should. This is mock code for now.
pub async fn login(Json(payload): Json<Location>) -> Json<HTTPResponse> {
	let fuh = AdditionResult {
		message: format!(
			"Added {} to {} = {}",
			payload.latitude,
			payload.longitude,
			payload.longitude + payload.latitude
		),
	};
	Json(HTTPResponse::success(
		ResponseData::AdditionResult(fuh),
		"login",
	))
}
