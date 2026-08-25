/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   generic.rs                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 23:30:01 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/25 18:17:56 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::errors::{GenericUserErrors, ValidatorErrors};
use argon2::{
	Argon2, PasswordHasher,
	password_hash::{SaltString, rand_core::OsRng},
};
use email_address::EmailAddress;
use regex::regex;
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use uuid::Uuid;

/// Represents a basic, freshly recieved user.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApiReqUser
{
	/// The user's email address.
	pub email_address: String,
	/// The user's encrypted password.
	pub password: String,
}

/// Represents a user who has been freshly created but stripped of private data.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ApiRespBasicUser
{
	/// The user's email address.
	pub email_address: String,
	/// The user's unique identifier.
	pub uuid: String,
}

/// Represents a Basic user.
pub struct BasicUser
{
	/// The user's email address.
	email_address: String,
	/// The user's encrypted password.
	password: String,
	/// The user's unique identifier.
	/// Can be used to be cross-referenced with business logic/data in a database.
	uuid: String,
}

impl BasicUser
{
	/// Create a new user from email_address and password. Generates a UUID for said user.
	pub fn from_api_user(api_user: ApiReqUser) -> Result<BasicUser, GenericUserErrors>
	{
		BasicUser::valid_email(&api_user.email_address)?;
		let pw: &String = BasicUser::valid_password(&api_user.password)?;
		let enc_pw: String = BasicUser::encrypt_password(pw)?;

		Ok(BasicUser {
			email_address: api_user.email_address,
			password: enc_pw,
			uuid: Uuid::new_v4().to_string(),
		})
	}

	/// Validates the email address. Returns an error if invalid, () if it is.
	fn valid_email(email: &String) -> Result<(), GenericUserErrors>
	{
		let _ = EmailAddress::from_str(&email).map_err(|_| GenericUserErrors::AddressInvalid)?;
		if regex!(r"^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9]+$").is_match(email) {
			Ok(())
		} else {
			Err(GenericUserErrors::AddressInvalid)
		}
	}

	/// Encrypts the passwords passed as parameter and updates the user object.
	/// Returns the passowrd if the encryption was successful, or a GenericUserErrors if it was not.
	fn encrypt_password(pw: &String) -> Result<String, GenericUserErrors>
	{
		let salt = SaltString::generate(&mut OsRng);
		let argon2 = Argon2::default();

		match argon2.hash_password(&pw.bytes().collect::<Vec<u8>>(), &salt) {
			Ok(pw) => Ok(pw.to_string()),
			Err(_) => Err(GenericUserErrors::PasswordHashFailed),
		}
	}

	/// Encrypts and changes the user's password.
	pub fn change_password(&mut self, new_password: &String) -> Result<(), GenericUserErrors>
	{
		let valid_pw: &String = BasicUser::valid_password(new_password)?;
		self.password = BasicUser::encrypt_password(&valid_pw)?;
		Ok(())
	}

	/// Checks if the users password is valid. The conditions are the following:
	/// - At least 8 characters long
	/// - At least 1 Uppercase letter.
	/// - At least 1 Lowercase letter.
	/// - At least 1 Symbol (non-alphanumeric character).
	/// - At least 1 Digit.
	/// Returns a clone of the user's password if it's valid.
	/// Returns a Vector of every error in ValidatorErrors format if it isn't.
	fn valid_password(pw: &String) -> Result<&String, GenericUserErrors>
	{
		static CONTEXT: &str = "password";
		let mut resp = Vec::new();
		let mut low_ok = false;
		let mut hig_ok = false;
		let mut sym_ok = false;
		let mut dig_ok = false;

		if pw.len() == 0 {
			resp.push(ValidatorErrors::new(
				CONTEXT.to_string(),
				format!("{}", GenericUserErrors::PasswordEmpty),
			));
			return Err(GenericUserErrors::PasswordError(resp));
		} else if pw.len() < 8 {
			resp.push(ValidatorErrors::new(
				CONTEXT.to_string(),
				format!("{}", GenericUserErrors::PasswordTooShort),
			));
		}

		for c in pw.chars() {
			if c.is_ascii_lowercase() {
				low_ok = true;
			} else if c.is_ascii_uppercase() {
				hig_ok = true;
			} else if c.is_ascii_digit() {
				dig_ok = true;
			} else if !c.is_alphanumeric() {
				sym_ok = true;
			}
		}

		if !low_ok {
			resp.push(ValidatorErrors::new(
				CONTEXT.to_string(),
				format!("{}", GenericUserErrors::PasswordNoLower),
			));
		}
		if !hig_ok {
			resp.push(ValidatorErrors::new(
				CONTEXT.to_string(),
				format!("{}", GenericUserErrors::PasswordNoUpper),
			));
		}
		if !sym_ok {
			resp.push(ValidatorErrors::new(
				CONTEXT.to_string(),
				format!("{}", GenericUserErrors::PasswordNoSymbol),
			));
		}
		if !dig_ok {
			resp.push(ValidatorErrors::new(
				CONTEXT.to_string(),
				format!("{}", GenericUserErrors::PasswordNoDigit),
			));
		}

		if resp.len() == 0 {
			Ok(pw)
		} else {
			Err(GenericUserErrors::PasswordError(resp))
		}
	}

	/// Validates and changes the user's email. Returns an error if it isn't,
	/// and does not update it.
	pub fn change_email(&mut self, new_email: &String) -> Result<(), GenericUserErrors>
	{
		BasicUser::valid_email(&new_email)?;
		self.email_address = new_email.clone();
		Ok(())
	}

	/// Returns a borrow of the user's password.
	pub fn get_password(&self) -> &String
	{
		&self.password
	}

	/// Returns a borrow of the user's email.
	pub fn get_email(&self) -> &String
	{
		&self.email_address
	}

	/// Returns a borrow of the user's uuid.
	pub fn get_uuid(&self) -> &String
	{
		&self.uuid
	}
}
