/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.rs                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:13:11 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/26 14:22:31 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::globals::HTTPResponse;
use axum::Json;
#[cfg(debug_assertions)]
use business::models::business::MatchaUser;

/// Returns a list of users. Used only in debug.
#[cfg(debug_assertions)]
pub async fn get_users() -> Json<HTTPResponse<'static, Vec<MatchaUser>>>
{
	Json(HTTPResponse::new(business::list_users(), "list"))
}
