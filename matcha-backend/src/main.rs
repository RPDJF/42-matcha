/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/15 19:50:07 by fclivaz           #+#    #+#             */
/*   Updated: 2026/06/17 21:28:12 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

mod models;
mod routes;
use axum::Router;
use std::error::Error;
use tokio::signal;

static API_V1: &str = "/api/v1";

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
	let app: Router = Router::new()
		.nest(API_V1, routes::get_routes())
		.nest(API_V1, routes::post_routes());

	let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;

	let ctrl_c_handler = async {
		signal::ctrl_c().await.expect("Could not bind to sigint.");
	};

	axum::serve(listener, app)
		.with_graceful_shutdown(ctrl_c_handler)
		.await?;
	Ok(())
}
