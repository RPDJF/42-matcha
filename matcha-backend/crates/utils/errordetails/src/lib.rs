/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lib.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/11/25 02:17:40 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/26 00:48:09 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use serde::Serialize;

/// Main `ErrorDetails` struct that holds:
#[derive(Serialize, Debug)]
pub struct ErrorDetails<T>
{
	/// The Error Code Enum, in order to match on it when handled.
	code: T,
	/// The Error Details, if it's a single type of error.
	#[serde(skip_serializing_if = "Option::is_none")]
	details: Option<String>,
	/// The Errors coming from a validator, held in an array.
	#[serde(skip_serializing_if = "Option::is_none")]
	validator: Option<Vec<ValidatorError>>,
}

impl<T> ErrorDetails<T>
where
	T: Clone + Serialize + Eq + PartialEq,
{
	/// Returns the error code enum.
	#[must_use]
	pub fn error_code(&self) -> T
	{
		self.code.clone()
	}

	pub const fn new(
		code: T,
		details: Option<String>,
		validator: Option<Vec<ValidatorError>>,
	) -> Self
	{
		Self {
			code,
			details,
			validator,
		}
	}
}

/// System to validate multiple errors that happen in a validator, eg a password
/// validator.
#[derive(Serialize, Clone, Debug, Eq, PartialEq)]
pub struct ValidatorError
{
	/// Where the error happened.
	context: String,
	/// Description of the error itself.
	details: String,
}

impl ValidatorError
{
	#[must_use]
	pub const fn new(context: String, details: String) -> Self
	{
		Self { context, details }
	}
}
