/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 15:55:12 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/24 23:49:35 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

mod globals;
mod routes;
use axum::Router;
use std::error::Error;
use tokio::signal;
use userlib::caches::{UserCache, create_cache};

/// Starts the Matcha backend!
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>>
{
	let datacache: UserCache = create_cache();

	let app: Router = Router::new()
		.nest(globals::API_V1, routes::get_routes())
		.nest(globals::API_V1, routes::post_routes())
		.with_state(datacache);

	let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;

	let ctrl_c_handler = async {
		signal::ctrl_c().await.expect("Could not bind to sigint.");
	};

	axum::serve(listener, app)
		.with_graceful_shutdown(ctrl_c_handler)
		.await?;
	Ok(())
}
