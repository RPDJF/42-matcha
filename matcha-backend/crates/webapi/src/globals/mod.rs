/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:02:08 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/25 19:34:08 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use business::models::business::MatchaUser;
use serde::Serialize;
use userlib::{errors::ErrorDetails, models::generic::ApiRespBasicUser};

pub static API_V1: &str = "/api/v1";

/// Temporary. Will get deleted later.
#[derive(Serialize, Clone)]
pub struct AdditionResult
{
	pub message: String,
}

/// Contains every possible data type being sent over in HTTPResponse.
#[derive(Serialize, Clone)]
#[serde(untagged)]
pub enum ResponseData
{
	/// Pretty much everything is temporary as of now.
	AdditionResult(AdditionResult),
	User(ApiRespBasicUser),
	UserList(Vec<MatchaUser>),
}

/// Normalized HTTPResponse struct.
#[derive(Serialize)]
pub struct HTTPResponse
{
	/// The origin of the data field. Absent if it's an error.
	#[serde(skip_serializing_if = "Option::is_none")]
	origin: Option<String>,

	/// The data sent from the webapi. Absent if it's an error.
	#[serde(skip_serializing_if = "Option::is_none")]
	data: Option<ResponseData>,

	/// The Error field in case of an error. Absent if it's valid data.
	#[serde(skip_serializing_if = "Option::is_none")]
	error: Option<ErrorDetails>,
}

/// We force instanciation of HTTPResponse only through ok and error
/// as a way to make sure HTTPResponse can be only one of both.
impl HTTPResponse
{
	/// Builds an HTTPResponse form valid data. Sets error to None.
	pub fn success(data: ResponseData, origin: &str) -> HTTPResponse
	{
		HTTPResponse {
			origin: Some(origin.to_string()),
			data: Some(data.clone()),
			error: None,
		}
	}
	/// Builds an HTTPResponse form an error. Sets origin and data to None.
	pub fn error(details: ErrorDetails) -> HTTPResponse
	{
		HTTPResponse {
			origin: None,
			data: None,
			error: Some(details),
		}
	}
}
