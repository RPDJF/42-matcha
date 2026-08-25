/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/22 16:19:57 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/25 16:59:45 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use serde::Serialize;
use thiserror::Error;

// I ain't gonna lie chief, I want to write more documentation about this but
// I'm fairly certain I'm going to give this part a huge rework down the line.
// So I kind of don't want to waste time writing doc for a system that might
// get completely scrapped and re-written.

#[derive(Serialize, Error, Clone, Debug)]
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
	#[error("Password hashing failed.")]
	PasswordHashFailed,
}

#[derive(Serialize, Clone, Debug)]
pub struct ValidatorErrors
{
	context: String,
	details: String,
}

impl ValidatorErrors
{
	pub fn new(context: String, details: String) -> ValidatorErrors
	{
		ValidatorErrors {
			context: context,
			details: details,
		}
	}
}

#[derive(Serialize, Debug)]
pub struct ErrorDetails
{
	code: GenericUserErrors,
	details: Option<String>,
	validator: Option<Vec<ValidatorErrors>>,
}

/// We force instanciation of ErrorDetails only through from_details and from_validator
/// as a way to make sure ErrorDetails can be only one of both.
impl ErrorDetails
{
	pub fn from_details(code: GenericUserErrors, details: &str) -> ErrorDetails
	{
		ErrorDetails {
			code: code,
			details: Some(details.to_string()),
			validator: None,
		}
	}

	pub fn from_validator(code: GenericUserErrors, validator: Vec<ValidatorErrors>)
	-> ErrorDetails
	{
		ErrorDetails {
			code: code,
			details: None,
			validator: Some(validator),
		}
	}

	pub fn error_code(&self) -> GenericUserErrors
	{
		self.code.clone()
	}
}
