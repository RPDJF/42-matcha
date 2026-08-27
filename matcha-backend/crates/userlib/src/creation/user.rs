/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/22 00:08:44 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/27 17:30:37 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use sea_orm::{DatabaseConnection, EntityTrait, IntoActiveModel};

use crate::{
	errors::{ErrorDetails, GenericUserErrors},
	models::{
		basicuser::{Entity as BasicUserEntity, Model as BasicUser},
		generic::{ApiReqUser, ApiRespBasicUser},
	},
};

async fn insert_into_hashmap(
	value: BasicUser,
	db: &DatabaseConnection,
) -> Result<ApiRespBasicUser, ErrorDetails>
{
	let mail = value.get_email().clone();
	let uuid = value.get_uuid().to_string();
	let f = value.into_active_model();

	BasicUserEntity::insert(f).exec(db).await.map_err(|_e| {
		ErrorDetails::from_details(
			GenericUserErrors::DatabaseInsertFailed,
			&format!("{}", GenericUserErrors::DatabaseInsertFailed),
		)
	})?;

	Ok(ApiRespBasicUser {
		email_address: mail,
		uuid,
	})
}

/// Validates a user's input and creates it. Does NOT insert it in the database.
/// TODO: Insert the user in a lookup table with session_id and otp_code.
pub async fn create_user(
	payload: ApiReqUser,
	db: &DatabaseConnection,
) -> Result<ApiRespBasicUser, ErrorDetails>
{
	match BasicUser::from_api_user(payload) {
		Ok(val) => Ok(insert_into_hashmap(val, db).await?),
		Err(error) => match error {
			GenericUserErrors::PasswordError(validator) => Err(ErrorDetails::from_validator(
				GenericUserErrors::PasswordInvalid,
				validator,
			)),
			_ => Err(ErrorDetails::from_details(
				error.clone(),
				&format!("{error}"),
			)),
		},
	}
}
