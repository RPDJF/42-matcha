/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mod.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/11/24 23:21:37 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/24 23:22:31 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use crate::models::generic::BasicUser;
use datacache::DataCache;

pub type UserCache = DataCache<String, (String, BasicUser)>;

#[must_use]
pub fn create_cache() -> UserCache
{
	DataCache::new()
}
