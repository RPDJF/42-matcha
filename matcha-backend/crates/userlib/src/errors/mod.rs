/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/22 16:19:57 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 00:43:01 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use datacache::errors::DatacacheError;
use serde::Serialize;
use thiserror::Error;

/// Contains every possible error that can happen during Generic User handling.
/// Derives from thiserror in order to have pre-formatted messages and avoid
/// having to manually implement message formatting.
#[derive(Serialize, Error, Clone, Debug, Eq, PartialEq)]
pub enum GenericUserErrors
{
	#[error("Invalid email address format.")]
	AddressInvalid,
	#[error("The address is already in use.")]
	AddressInUse,
	#[error("Incorrect password.")]
	PasswordIncorrect,
	#[error("Error validating password.")]
	PasswordError(Vec<ValidatorErrors>),
	#[error("Invalid password.")]
	PasswordInvalid,
	#[error("Empty password submitted.")]
	PasswordEmpty,
	#[error("Password must be at least 8 characters long.")]
	PasswordTooShort,
	#[error("Password must contain at least one lowercase character.")]
	PasswordNoLower,
	#[error("Password must contain at least one uppercase character.")]
	PasswordNoUpper,
	#[error("Password must contain at least one symbol.")]
	PasswordNoSymbol,
	#[error("Password must contain at least one digit.")]
	PasswordNoDigit,
	#[error("Validation timed out.")]
	ValidationTimeout,
	#[error("Account not found.")]
	AccountNotFound,
	#[error("Account already exists.")]
	AccountExists,
	#[error("Too many Attempts.")]
	TooManyAttempts,
	#[error("Internal Server Error.")]
	InternalError,
}

/// System to validate multiple errors that happen in a validator, eg a password
/// validator.
#[derive(Serialize, Clone, Debug, Eq, PartialEq)]
pub struct ValidatorErrors
{
	/// Where the error happened.
	context: String,
	/// Description of the error itself.
	details: String,
}

impl ValidatorErrors
{
	#[must_use]
	pub fn new(context: String, details: String) -> ValidatorErrors
	{
		ValidatorErrors {
			context: context,
			details: details,
		}
	}
}

/// Main `ErrorDetails` struct that holds:
#[derive(Serialize, Debug)]
pub struct ErrorDetails
{
	/// The Error Code Enum, in order to match on it when handled.
	code: GenericUserErrors,
	/// The Error Details, if it's a single type of error.
	#[serde(skip_serializing_if = "Option::is_none")]
	details: Option<String>,
	/// The Errors coming from a validator, held in an array.
	#[serde(skip_serializing_if = "Option::is_none")]
	validator: Option<Vec<ValidatorErrors>>,
}

impl ErrorDetails
{
	/// Returns the error code enum.
	#[must_use]
	pub fn error_code(&self) -> GenericUserErrors
	{
		self.code.clone()
	}
}

impl From<GenericUserErrors> for ErrorDetails
{
	/// Constructs an `ErrorDetails` from a single `GenericUserErrors` enum
	/// option.
	fn from(err: GenericUserErrors) -> Self
	{
		ErrorDetails {
			code: err.clone(),
			details: Some(format!("{err}")),
			validator: None,
		}
	}
}

impl From<(GenericUserErrors, Vec<ValidatorErrors>)> for ErrorDetails
{
	/// Constructs an `ErrorDetails` from an array of errors coming from a
	/// Validator.
	fn from(err: (GenericUserErrors, Vec<ValidatorErrors>)) -> Self
	{
		ErrorDetails {
			code: err.0,
			details: None,
			validator: Some(err.1),
		}
	}
}

impl From<DatacacheError> for ErrorDetails
{
	/// Constructs an `ErrorDetails` from a `DatacacheError`.
	fn from(err: DatacacheError) -> Self
	{
		let code = match err {
			DatacacheError::EntryExpired => GenericUserErrors::ValidationTimeout,
			DatacacheError::LockError => GenericUserErrors::InternalError,
			DatacacheError::EntryNotFound => GenericUserErrors::AccountNotFound,
			DatacacheError::EntryExists => GenericUserErrors::AccountExists,
			DatacacheError::TooManyEntries => GenericUserErrors::TooManyAttempts,
		};
		ErrorDetails {
			code: code.clone(),
			details: Some(format!("{code}")),
			validator: None,
		}
	}
}
