/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   generic.rs                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 23:30:01 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/27 16:44:31 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use serde::{Deserialize, Serialize};

/// Represents a basic, freshly recieved user.
#[derive(Serialize, Deserialize)]
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
