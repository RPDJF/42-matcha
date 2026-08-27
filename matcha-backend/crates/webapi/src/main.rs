/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 15:55:12 by fclivaz           #+#    #+#             */
/*   Updated: 2026/08/27 16:35:19 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

mod globals;
mod routes;
use axum::Router;
use sea_orm::{Database, DatabaseConnection};
use std::error::Error;
use tokio::signal;

/// Starts the Matcha backend!
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>>
{
	// Yes this is sqlite for now. deal with it. i will switch to mysql later
	let db = Database::connect("sqlite://./sqlite.db?mode=rwc").await?;
	db.get_schema_registry("userlib::models::*")
		.sync(&db)
		.await?;

	let app: Router = Router::new()
		.nest(globals::API_V1, routes::get_routes())
		.nest(globals::API_V1, routes::post_routes())
		.with_state(db);

	let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;

	let ctrl_c_handler = async {
		signal::ctrl_c().await.expect("Could not bind to sigint.");
	};

	axum::serve(listener, app)
		.with_graceful_shutdown(ctrl_c_handler)
		.await?;
	Ok(())
}

#[cfg(test)]
#[allow(clippy::pedantic)]
#[allow(clippy::nursery)]
mod tests;
