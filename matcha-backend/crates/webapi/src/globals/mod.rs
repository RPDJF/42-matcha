/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:02:08 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/26 14:22:39 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::errors::ErrorTypes;
use serde::{Deserialize, Serialize};

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
pub struct Claims<T: Clone>
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

/// Create trait `ResponseData` which requires Clone and Serialize.
pub trait ResponseData: Clone + Serialize {}
/// Blanket trait application over that implements Serialize and Clone.
impl<T: Serialize + Clone> ResponseData for T {}

/// Normalized `HTTPResponse` struct.
#[derive(Serialize)]
pub struct HTTPResponse<'a, T>
{
	/// The origin of the data field. Absent if it's an error.
	#[serde(skip_serializing_if = "Option::is_none")]
	origin: Option<&'a str>,

	/// The data sent from the webapi. Absent if it's an error.
	#[serde(skip_serializing_if = "Option::is_none")]
	data: Option<T>,

	/// The Error field in case of an error. Absent if it's valid data.
	#[serde(skip_serializing_if = "Option::is_none")]
	error: Option<ErrorTypes>,
}

/// We force instanciation of `HTTPResponse` only through ok and error
/// as a way to make sure `HTTPResponse` can be only one of both.
impl<'a, T: ResponseData> HTTPResponse<'a, T>
{
	/// Builds an `HTTPResponse` form valid data. Sets error to None.
	pub const fn new(data: T, origin: &'a str) -> Self
	{
		Self {
			origin: Some(origin),
			data: Some(data),
			error: None,
		}
	}

	/// Builds an `HTTPResponse` form an error. Sets origin and data to None.
	pub const fn err(details: ErrorTypes) -> Self
	{
		Self {
			origin: None,
			data: None,
			error: Some(details),
		}
	}
}
