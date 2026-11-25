/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/22 00:08:44 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 04:05:35 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::{
	caches::UserCache,
	errors::{FromUserlibErrors, GenericUserErrors, ValidatorErrors},
	models::generic::{ApiReqUser, ApiRespBasicUser, BasicUser},
};
use datacache::Seconds;
use error_details::ErrorDetails;
use rand::RngExt;

/// Inserts a validated user into the `DataCache` alongside its validation code in
/// a tuple. The `session_id` is used as the key for the `DataCache`
/// # Result
/// Returns: A string containing the 6-digit one time validation code.
/// # Errors
/// Returns an `ErrorDetails` containing the details of the error that has
/// occurred.
fn insert_into_hashmap(
	new_user: BasicUser,
	datacache: &UserCache,
	session_id: &str,
) -> Result<String, ErrorDetails<GenericUserErrors, ValidatorErrors>>
{
	let mut str = String::with_capacity(6);
	let mut rng = rand::rng();
	for _ in 0..6 {
		str += &rng.random_range(0..10).to_string();
	}

	let otp_and_user = (str.clone(), new_user);

	// TODO: check pending duplicates

	match datacache.insert(&String::from(session_id), &otp_and_user, &Seconds(5 * 60)) {
		Ok(()) => Ok(str),
		Err(val) => Err(ErrorDetails::from_userlib(val)),
	}
}

/// Validates a user creation requests and inserts it into the `DataCache` for
/// further validation.
/// # Result
/// Returns: A string containing the 6-digit one time validation code.
/// # Errors
/// Returns an `ErrorDetails` containing the details of the error that has
/// occurred.
pub fn generate_new_user(
	payload: ApiReqUser,
	datacache: &UserCache,
	session_id: &str,
) -> Result<String, ErrorDetails<GenericUserErrors, ValidatorErrors>>
{
	match BasicUser::from_api_user(payload) {
		Ok(val) => Ok(insert_into_hashmap(val, datacache, session_id)?),
		Err(error) => match error {
			GenericUserErrors::PasswordError(validator) => Err(ErrorDetails::from_userlib((
				GenericUserErrors::PasswordInvalid,
				validator,
			))),
			_ => Err(ErrorDetails::from_userlib(error)),
		},
	}
}

/// Retrieves a user from the `DataCache`.
/// # Result
/// Returns: The user when found and with a matching `otp`.
/// # Errors
/// Returns an `ErrorDetails` containing the details of the error that has
/// occurred.
fn get_user_from_hash(
	otp: &str,
	id: &str,
	datacache: &UserCache,
) -> Result<BasicUser, ErrorDetails<GenericUserErrors, ValidatorErrors>>
{
	match datacache.get(&String::from(id)) {
		Ok(val) => {
			if otp == val.0 {
				return Ok(val.1);
			}
			Err(ErrorDetails::from_userlib(GenericUserErrors::IncorrectOTP))
		}
		Err(e) => Err(ErrorDetails::from_userlib(e)),
	}
}

/// Validates a new user with its `session_id` and `otp`.
/// # Result
/// Returns: The user when found and with a matching `otp`.
/// # Errors
/// Returns an `ErrorDetails` containing the details of the error that has
/// occurred.
pub async fn validate_new_user(
	otp: String,
	datacache: &UserCache,
	session_id: &str,
) -> Result<ApiRespBasicUser, ErrorDetails<GenericUserErrors, ValidatorErrors>>
{
	match get_user_from_hash(&otp, session_id, datacache) {
		Ok(val) => Ok(ApiRespBasicUser {
			email_address: val.get_email().clone(),
			uuid: val.get_uuid().to_string(),
		}),
		Err(e) => Err(e),
	}
	// FIXME: This SHOULD NOT be in Userlib, this should be abstracted away
	// in its own module!
	// let user_active_model = user.into_active_model();
	// let tx = BasicUserEntity::insert(user_active_model)
	// 	.exec(db)
	// 	.await
	// 	.map_err(|_e| {
	// 		ErrorDetails::from_userlib_details(
	// 			GenericUserErrors::DatabaseInsertFailed,
	// 			&format!("{}", GenericUserErrors::DatabaseInsertFailed),
	// 		)
	// 	})?;
}
