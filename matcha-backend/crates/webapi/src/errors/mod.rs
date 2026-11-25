/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/11/25 03:28:17 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/26 00:52:43 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use error_details::ErrorDetails;
use serde::Serialize;
use userlib::errors::UserLibErrors;

/// Contains every possible error that can happen during Web API operations.
/// Derives from thiserror in order to have pre-formatted messages and avoid
/// having to manually implement message formatting.
#[derive(Serialize, Debug, Clone, Eq, PartialEq, thiserror::Error)]
pub enum WebApiErrorTypes
{
	#[error("Session ID not provided.")]
	NoSessionID,
}

pub type WebApiErrors = ErrorDetails<WebApiErrorTypes>;

/// Encapsulates every error type that can be thrown in an HTTPResponse struct.
#[derive(Serialize)]
#[serde(untagged)]
pub enum ErrorTypes
{
	UserLibErrors(UserLibErrors),
	WebApiErrors(WebApiErrors),
}

pub trait FromWebApiErrors<T>
{
	fn from_webapi(err: T) -> Self;
}

impl FromWebApiErrors<WebApiErrorTypes> for ErrorDetails<WebApiErrorTypes>
{
	/// Constructs an `ErrorDetails` from a single `WebApiErrorTypes` enum
	/// option.
	fn from_webapi(err: WebApiErrorTypes) -> Self
	{
		Self::new(err.clone(), Some(format!("{err}")), None)
	}
}
