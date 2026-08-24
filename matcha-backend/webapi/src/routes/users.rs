/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.rs                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 16:13:11 by fclivaz           #+#    #+#             */
/*   Updated: 2026/06/21 16:39:37 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use axum::Json;
use business::DBUser;

pub async fn get_users() -> Json<Vec<DBUser>> {
	Json(business::list_users())
}
