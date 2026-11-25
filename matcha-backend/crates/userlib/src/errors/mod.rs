/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/22 16:19:57 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 18:36:24 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use datacache::errors::DatacacheError;
use error_details::ErrorDetails;
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
	#[error("Incorrect Validation Code.")]
	IncorrectOTP,
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
	pub const fn new(context: String, details: String) -> Self
	{
		Self {
			context: context,
			details: details,
		}
	}
}

pub type UserLibErrors = ErrorDetails<GenericUserErrors, ValidatorErrors>;

pub trait FromUserlibErrors<T>
{
	fn from_userlib(err: T) -> Self;
}

impl FromUserlibErrors<GenericUserErrors> for ErrorDetails<GenericUserErrors, ValidatorErrors>
{
	/// Constructs an `ErrorDetails` from a single `GenericUserErrors` enum
	/// option.
	fn from_userlib(err: GenericUserErrors) -> Self
	{
		Self::new(err.clone(), Some(format!("{err}")), None)
	}
}

impl FromUserlibErrors<(GenericUserErrors, Vec<ValidatorErrors>)>
	for ErrorDetails<GenericUserErrors, ValidatorErrors>
{
	/// Constructs an `ErrorDetails` from an array of errors coming from a
	/// Validator.
	fn from_userlib(err: (GenericUserErrors, Vec<ValidatorErrors>)) -> Self
	{
		Self::new(err.0, None, Some(err.1))
	}
}

impl FromUserlibErrors<DatacacheError> for ErrorDetails<GenericUserErrors, ValidatorErrors>
{
	/// Constructs an `ErrorDetails` from a `DatacacheError`.
	fn from_userlib(err: DatacacheError) -> Self
	{
		let code = match err {
			DatacacheError::EntryExpired => GenericUserErrors::ValidationTimeout,
			DatacacheError::LockError => GenericUserErrors::InternalError,
			DatacacheError::EntryNotFound => GenericUserErrors::AccountNotFound,
			DatacacheError::EntryExists => GenericUserErrors::AccountExists,
			DatacacheError::TooManyEntries => GenericUserErrors::TooManyAttempts,
		};
		Self::new(code.clone(), Some(format!("{code}")), None)
	}
}
