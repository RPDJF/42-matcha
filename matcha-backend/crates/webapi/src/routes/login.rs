/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.rs                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:30:10 by fclivaz           #+#    #+#             */
/*   Updated: 2026/06/21 16:33:31 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use axum::Json;
use business::Location;
use serde::Serialize;

#[derive(Serialize)]
pub struct Succ {
	cess: String,
}

pub async fn login(Json(payload): Json<Location>) -> Json<Succ> {
	Json(Succ {
		cess: format!(
			"what's 9 + 10? {}",
			business::add(payload.latitude, payload.longitude),
		),
	})
}
