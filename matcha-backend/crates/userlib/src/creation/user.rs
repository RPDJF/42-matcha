/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/22 00:08:44 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 00:33:53 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::{
	caches::UserCache,
	errors::{ErrorDetails, GenericUserErrors},
	models::generic::{ApiReqUser, BasicUser},
};
use datacache::Seconds;
use rand::RngExt;

/// Inserts a validated user into the DataCache alongside its validation code in
/// a tuple. The `session_id` is used as the key for the DataCache
/// # Result
/// Returns: A string containing the 6-digit one time validation code.
/// # Errors
/// Returns an ErrorDetails containing the details of the error that has
/// occurred.
fn insert_into_hashmap(
	new_user: BasicUser,
	datacache: &UserCache,
	session_id: &str,
) -> Result<String, ErrorDetails>
{
	let mut str = String::with_capacity(6);
	let mut rng = rand::rng();
	for _ in 0..6 {
		str += &rng.random_range(0..10).to_string();
	}

	let otp_and_user = (str.clone(), new_user);

	// TODO: check pending duplicates

	match datacache.insert(&String::from(session_id), &otp_and_user, &Seconds(5 * 60)) {
		Ok(_) => Ok(str),
		Err(val) => Err(ErrorDetails::from(val)),
	}
}

/// Validates a user creation requests and inserts it into the DataCache for
/// further validation.
/// # Result
/// Returns: A string containing the 6-digit one time validation code.
/// # Errors
/// Returns an ErrorDetails containing the details of the error that has
/// occurred.
pub fn generate_new_user(
	payload: ApiReqUser,
	datacache: &UserCache,
	session_id: &str,
) -> Result<String, ErrorDetails>
{
	match BasicUser::from_api_user(payload) {
		Ok(val) => Ok(insert_into_hashmap(val, datacache, session_id)?),
		Err(error) => match error {
			GenericUserErrors::PasswordError(validator) => Err(ErrorDetails::from((
				GenericUserErrors::PasswordInvalid,
				validator,
			))),
			_ => Err(ErrorDetails::from(error.clone())),
		},
	}
}
