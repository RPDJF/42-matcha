/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   basicuser.rs                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/08/27 01:33:27 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/27 17:32:04 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use sea_orm::entity::prelude::*;

use crate::{
	errors::{GenericUserErrors, ValidatorErrors},
	models::generic::ApiReqUser,
};
use argon2::{
	Argon2, PasswordHasher,
	password_hash::{SaltString, rand_core::OsRng},
};
use email_address::EmailAddress;
use regex::regex;
use std::str::FromStr;
use uuid::Uuid;

#[sea_orm::model]
#[derive(Clone, DeriveEntityModel, Debug, PartialEq, Eq)]
#[sea_orm(table_name = "BasicUser")]
/// Represents a Basic user.
pub struct Model
{
	/// The user's unique identifier.
	/// Can be used to be cross-referenced with business logic/data in a database.
	#[sea_orm(primary_key)]
	uuid: Uuid,
	/// The user's email address.
	#[sea_orm(unique)]
	email_address: String,
	/// The user's encrypted password.
	password: String,
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {}

impl Model
{
	/// Create a new user from email_address and password. Generates a UUID for said user.
	pub fn from_api_user(api_user: ApiReqUser) -> Result<Self, GenericUserErrors>
	{
		Self::valid_email(&api_user.email_address)?;
		let pw: &str = Self::valid_password(&api_user.password)?;
		let enc_pw: String = Self::encrypt_password(pw)?;

		Ok(Self {
			email_address: api_user.email_address,
			password: enc_pw,
			uuid: Uuid::new_v4(),
		})
	}

	/// Validates the email address. Returns an error if invalid, () if it is.
	fn valid_email(email: &str) -> Result<(), GenericUserErrors>
	{
		let _ = EmailAddress::from_str(email).map_err(|_i| GenericUserErrors::AddressInvalid)?;

		if regex!(r"^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9]+$").is_match(email) {
			Ok(())
		} else {
			Err(GenericUserErrors::AddressInvalid)
		}
	}

	/// Encrypts the passwords passed as parameter and updates the user object.
	/// Returns the passowrd if the encryption was successful, or a GenericUserErrors if it was not.
	fn encrypt_password(pw: &str) -> Result<String, GenericUserErrors>
	{
		let salt = SaltString::generate(&mut OsRng);
		let argon2 = Argon2::default();
		argon2
			.hash_password(&pw.bytes().collect::<Vec<u8>>(), &salt)
			.map_or(Err(GenericUserErrors::PasswordHashFailed), |pw| {
				Ok(pw.to_string())
			})
	}

	/// Encrypts and changes the user's password.
	pub fn change_password(&mut self, new_password: &str) -> Result<(), GenericUserErrors>
	{
		let valid_pw: &str = Self::valid_password(new_password)?;
		self.password = Self::encrypt_password(valid_pw)?;
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
	fn valid_password(pw: &str) -> Result<&str, GenericUserErrors>
	{
		static CONTEXT: &str = "password";
		let mut resp = Vec::new();
		let mut low_ok = false;
		let mut hig_ok = false;
		let mut sym_ok = false;
		let mut dig_ok = false;

		if pw.is_empty() {
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

		for char in pw.chars() {
			if char.is_ascii_lowercase() {
				low_ok = true;
			} else if char.is_ascii_uppercase() {
				hig_ok = true;
			} else if char.is_ascii_digit() {
				dig_ok = true;
			} else if !char.is_alphanumeric() {
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

		if resp.is_empty() {
			Ok(pw)
		} else {
			Err(GenericUserErrors::PasswordError(resp))
		}
	}

	/// Validates and changes the user's email. Returns an error if it isn't,
	/// and does not update it.
	pub fn change_email(&mut self, new_email: &String) -> Result<(), GenericUserErrors>
	{
		Self::valid_email(new_email)?;
		self.email_address.clone_from(new_email);
		Ok(())
	}

	/// Returns a borrow of the user's password.
	#[must_use]
	pub const fn get_password(&self) -> &String
	{
		&self.password
	}

	/// Returns a borrow of the user's email.
	#[must_use]
	pub const fn get_email(&self) -> &String
	{
		&self.email_address
	}

	/// Returns a borrow of the user's uuid.
	#[must_use]
	pub const fn get_uuid(&self) -> &Uuid
	{
		&self.uuid
	}

	pub fn regen_uuid(&mut self)
	{
		self.uuid = Uuid::new_v4();
	}
}
