/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   register.rs                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 18:53:59 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/27 04:27:05 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::globals::{HTTPResponse, ResponseData};
use axum::{Json, extract::State, http::StatusCode};
use sea_orm::DatabaseConnection;
use userlib::{
	creation::user::create_user, errors::GenericUserErrors, models::generic::ApiReqUser,
};

/// Registers a new user.
/// Returns 202 Accepted with a copy of the user if successful.
/// Returns 400 Bad Request on a wrong password or email.
/// Returns 409 Conflict if the email address already exists.
/// TODO: return 202 with session cookie.
pub async fn register(
	State(db): State<DatabaseConnection>,
	Json(payload): Json<ApiReqUser>,
) -> (StatusCode, Json<HTTPResponse>)
{
	match create_user(payload, &db).await {
		Ok(val) => (
			StatusCode::ACCEPTED,
			Json(HTTPResponse::success(ResponseData::User(val), "login")),
		),
		Err(error) => match error.error_code() {
			GenericUserErrors::AddressInvalid => {
				(StatusCode::CONFLICT, Json(HTTPResponse::error(error)))
			}
			_ => (StatusCode::BAD_REQUEST, Json(HTTPResponse::error(error))),
		},
	}
}
