/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   register.rs                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 18:53:59 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 03:46:44 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::{
	errors::ErrorTypes::UserLibErrors,
	globals::{HTTPResponse, OtpCode, SESSION_ID},
};
use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::{
	CookieJar,
	cookie::{Cookie, SameSite},
};
use rand::distr::{Alphanumeric, SampleString};
use time::Duration;
use userlib::{
	caches::UserCache, creation::user::generate_new_user, errors::GenericUserErrors,
	models::generic::ApiReqUser,
};

/// Registers a new user.
/// Returns:
/// - 202 Accepted with the OTP Code used for validation as a result.
/// - - Also sends a SessionID HTTP-only cookie used for validation.
/// - 400 Bad Request on a wrong password or email.
/// - 409 Conflict if the email address already exists.
/// - 500 Internal Server Error if something goes horribly wrong in the API.
pub async fn register(
	State(db): State<UserCache>,
	jar: CookieJar,
	Json(payload): Json<ApiReqUser>,
) -> (StatusCode, CookieJar, Json<HTTPResponse<OtpCode>>)
{
	let id = jar
		.get(SESSION_ID)
		.map(|cookie| cookie.value().to_owned())
		.unwrap_or_else(|| Alphanumeric.sample_string(&mut rand::rng(), 32));

	match generate_new_user(payload, &db, &id) {
		Ok(val) => {
			let cookie = Cookie::build((SESSION_ID, id))
				.http_only(true)
				.secure(true)
				.same_site(SameSite::Lax)
				.path("/")
				.max_age(Duration::minutes(5))
				.build();
			(
				StatusCode::ACCEPTED,
				jar.add(cookie),
				Json(HTTPResponse::new(OtpCode { otp_code: val }, "register")),
			)
		}
		Err(error)
			if error.error_code() == GenericUserErrors::AddressInUse
				&& error.error_code() == GenericUserErrors::AccountExists =>
		{
			(
				StatusCode::CONFLICT,
				jar,
				Json(HTTPResponse::err(UserLibErrors(error))),
			)
		}
		Err(error) if error.error_code() == GenericUserErrors::InternalError => (
			StatusCode::INTERNAL_SERVER_ERROR,
			jar,
			Json(HTTPResponse::err(UserLibErrors(error))),
		),
		Err(error) => (
			StatusCode::BAD_REQUEST,
			jar,
			Json(HTTPResponse::err(UserLibErrors(error))),
		),
	}
}
