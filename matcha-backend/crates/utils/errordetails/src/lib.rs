/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lib.rs                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/11/25 02:17:40 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 02:29:30 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

use serde::Serialize;

/// Main `ErrorDetails` struct that holds:
#[derive(Serialize, Debug)]
pub struct ErrorDetails<T, V>
{
	/// The Error Code Enum, in order to match on it when handled.
	code: T,
	/// The Error Details, if it's a single type of error.
	#[serde(skip_serializing_if = "Option::is_none")]
	details: Option<String>,
	/// The Errors coming from a validator, held in an array.
	#[serde(skip_serializing_if = "Option::is_none")]
	validator: Option<Vec<V>>,
}

impl<T, V> ErrorDetails<T, V>
where
	T: Clone + Serialize + Eq + PartialEq,
	V: Clone + Serialize + Eq + PartialEq,
{
	/// Returns the error code enum.
	#[must_use]
	pub fn error_code(&self) -> T
	{
		self.code.clone()
	}

	pub fn new(code: T, details: Option<String>, validator: Option<Vec<V>>) -> Self
	{
		Self {
			code,
			details,
			validator,
		}
	}
}
