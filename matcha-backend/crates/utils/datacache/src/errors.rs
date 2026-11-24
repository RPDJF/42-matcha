/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errors.rs                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/11/24 20:28:23 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/24 20:40:40 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use core::fmt;

/// Errors are manually implemented in order to reduce dependency on other
/// crates. We are trying to make this crate depend on nothing but the
/// standard library.

#[derive(Clone, Debug)]
pub enum DatacacheError
{
	EntryExpired,
	LockError,
	EntryNotFound,
	EntryExists,
	TooManyEntries,
}

impl fmt::Display for DatacacheError
{
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result
	{
		match self {
			DatacacheError::EntryExpired => write!(f, "Item has expried."),
			DatacacheError::LockError => write!(f, "Unable to get clean lock."),
			DatacacheError::EntryNotFound => write!(f, "Item not found."),
			DatacacheError::EntryExists => write!(f, "Item already exists in cache."),
			DatacacheError::TooManyEntries => {
				write!(f, "Too many similar items already exist in cache.")
			}
		}
	}
}
