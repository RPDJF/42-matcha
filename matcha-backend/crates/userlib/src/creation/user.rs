/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/22 00:08:44 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/25 16:36:03 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::{
	errors::{ErrorDetails, GenericUserErrors},
	models::generic::{ApiReqUser, ApiRespBasicUser, BasicUser},
};

/// Validates a user's input and creates it. Does NOT insert it in the database.
/// TODO: Insert the user in a lookup table with session_id and otp_code.
pub fn create_user(payload: ApiReqUser) -> Result<ApiRespBasicUser, ErrorDetails>
{
	//TODO:: check if email is already in use.
	match BasicUser::from_api_user(payload) {
		Ok(val) => Ok(ApiRespBasicUser {
			email_address: val.get_email().clone(),
			uuid: val.get_uuid().clone(),
		}),
		Err(error) => match error {
			GenericUserErrors::PasswordError(validator) => Err(ErrorDetails::from_validator(
				GenericUserErrors::PasswordInvalid,
				validator,
			)),
			_ => Err(ErrorDetails::from_details(
				error.clone(),
				&format!("{}", error),
			)),
		},
	}
}
