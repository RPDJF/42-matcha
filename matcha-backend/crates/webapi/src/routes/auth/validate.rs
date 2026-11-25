/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   validate.rs                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/11/25 01:16:54 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 03:58:21 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::{
	errors::{
		ErrorTypes::{UserLibErrors, WebApiErrors},
		FromWebApiErrors,
		WebApiErrorTypes::NoSessionID,
	},
	globals::{Claims, HTTPResponse, OtpCode, SECONDS, SECRET, SESSION_ID},
};
use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use error_details::ErrorDetails;
use jsonwebtoken::{EncodingKey, Header, encode};
use std::time::{SystemTime, UNIX_EPOCH};
use userlib::{
	caches::UserCache, creation::user::validate_new_user, errors::GenericUserErrors,
	models::generic::ApiRespBasicUser,
};

/// Creates a JWT to return to the user.
pub fn create_token(user: ApiRespBasicUser) -> Claims<String>
{
	let timestamp = SystemTime::now()
		.duration_since(UNIX_EPOCH)
		.unwrap_or_default()
		.as_millis() as u64;

	let uuid = user.uuid.clone();

	let token_data = Claims {
		exp: timestamp + SECONDS,
		iat: timestamp,
		iss: String::from("user_validation"),
		sub: uuid.clone(),
		data: user,
	};

	let token = encode(
		&Header::default(),
		&token_data,
		&EncodingKey::from_secret(SECRET.as_ref()),
	)
	.unwrap();

	Claims {
		exp: timestamp + SECONDS,
		iat: timestamp,
		iss: String::from("user_validation"),
		sub: uuid,
		data: token,
	}
}

/// Validates a user that's currently attempting to create an account.
/// Headers: Requires the same `SessionID` that was given in /register.
/// Body: requires an `otpCode` value in the body to match with the `DataCache`.
/// Returns:
/// - 201 Created if OTP and SessionID match. Creates the user.
/// - 400 If the OTP or `SessionID` are wrong or missing.
/// - 409 Conflict if the user already exists in the database.
pub async fn validate(
	State(db): State<UserCache>,
	jar: CookieJar,
	Json(otp_code): Json<OtpCode>,
) -> (StatusCode, Json<HTTPResponse<Claims<String>>>)
{
	if let Some(id) = jar.get(SESSION_ID).map(|cookie| cookie.value().to_owned()) {
		match validate_new_user(otp_code.otp_code, &db, &id).await {
			Ok(val) => {
				return (
					StatusCode::CREATED,
					Json(HTTPResponse::new(create_token(val), "validate")),
				);
			}
			Err(error)
				if error.error_code() == GenericUserErrors::AddressInUse
					|| error.error_code() == GenericUserErrors::AccountExists =>
			{
				return (
					StatusCode::CONFLICT,
					Json(HTTPResponse::err(UserLibErrors(error))),
				);
			}
			Err(error) => {
				return (
					StatusCode::BAD_REQUEST,
					Json(HTTPResponse::err(UserLibErrors(error))),
				);
			}
		}
	}
	return (
		StatusCode::BAD_REQUEST,
		Json(HTTPResponse::err(WebApiErrors(ErrorDetails::from_webapi(
			NoSessionID,
		)))),
	);
}
