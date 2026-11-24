/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:02:08 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/24 23:34:15 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use business::errors::MatchaError;
use serde::{Deserialize, Serialize};
use userlib::errors::ErrorDetails;

pub static API_V1: &str = "/api/v1";
pub static SECONDS: u64 = 30 * 1000;
pub static SESSION_ID: &str = "SessionID";
pub static SECRET: &str =
	"SUPER_SECRET_KEY_OMG_PLEASE_DONT_LEAK_ON_GITHUB_OR_ELSE_I_WILL_LOSE_MY_CRYPTO_WALLET";

/// Temporary. Will get deleted later.
#[derive(Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct OtpCode
{
	pub otp_code: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Claims<T: Serialize + Clone>
{
	// Expires at
	pub exp: u64,
	// Issued at
	pub iat: u64,
	// Issued by
	pub iss: String,
	// Subject (EG. User ID, whatever the JWT refers to)
	pub sub: String,
	// Role of the user
	pub data: T,
}

/// Create trait ResponseData which requires Clone and Serialize.
pub trait ResponseData: Clone + Serialize {}
/// Blanket trait application over that implements Serialize and Clone.
impl<T: Serialize + Clone> ResponseData for T {}

/// Normalized HTTPResponse struct.
#[derive(Serialize)]
pub struct HTTPResponse<T, E>
{
	/// The origin of the data field. Absent if it's an error.
	#[serde(skip_serializing_if = "Option::is_none")]
	origin: Option<String>,

	/// The data sent from the webapi. Absent if it's an error.
	#[serde(skip_serializing_if = "Option::is_none")]
	data: Option<T>,

	/// The Error field in case of an error. Absent if it's valid data.
	#[serde(skip_serializing_if = "Option::is_none")]
	error: Option<E>,
}

pub trait WebApiError: Serialize {}

impl WebApiError for ErrorDetails {}
impl WebApiError for MatchaError {}

/// We force instanciation of HTTPResponse only through ok and error
/// as a way to make sure HTTPResponse can be only one of both.
impl<T: ResponseData, E: WebApiError> HTTPResponse<T, E>
{
	/// Builds an HTTPResponse form valid data. Sets error to None.
	pub fn new(data: T, origin: &str) -> Self
	{
		HTTPResponse {
			origin: Some(origin.to_string()),
			data: Some(data.clone()),
			error: None,
		}
	}

	/// Builds an HTTPResponse form an error. Sets origin and data to None.
	pub fn err(details: E) -> Self
	{
		HTTPResponse {
			origin: None,
			data: None,
			error: Some(details),
		}
	}
}
