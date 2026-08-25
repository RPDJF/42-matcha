/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 15:55:12 by fclivaz           #+#    #+#             */
/*   Updated: 2026/07/08 20:28:54 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

mod globals;
mod routes;
use axum::Router;
use std::error::Error;
use tokio::signal;

/// Starts the Matcha backend!
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
	let app: Router = Router::new()
		.nest(globals::API_V1, routes::get_routes())
		.nest(globals::API_V1, routes::post_routes());

	let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;

	let ctrl_c_handler = async {
		signal::ctrl_c().await.expect("Could not bind to sigint.");
	};

	axum::serve(listener, app)
		.with_graceful_shutdown(ctrl_c_handler)
		.await?;
	Ok(())
}
