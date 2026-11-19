/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   register.rs                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 18:53:59 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/20 00:16:36 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::globals::HTTPResponse;
use axum::{Json, http::StatusCode};
use userlib::{
	creation::user::create_user,
	errors::{ErrorDetails, GenericUserErrors},
	models::generic::{ApiReqUser, ApiRespBasicUser},
};

/// Registers a new user.
/// Returns 202 Accepted with a copy of the user if successful.
/// Returns 400 Bad Request on a wrong password or email.
/// Returns 409 Conflict if the email address already exists.
/// TODO: return 202 with session cookie.
pub async fn register(
	Json(payload): Json<ApiReqUser>,
) -> (
	StatusCode,
	Json<HTTPResponse<ApiRespBasicUser, ErrorDetails>>,
)
{
	match create_user(payload) {
		Ok(val) => (StatusCode::ACCEPTED, Json(HTTPResponse::new(val, "login"))),
		Err(error) => match error.error_code() {
			GenericUserErrors::AddressInvalid => {
				(StatusCode::CONFLICT, Json(HTTPResponse::err(error)))
			}
			_ => (StatusCode::BAD_REQUEST, Json(HTTPResponse::err(error))),
		},
	}
}
