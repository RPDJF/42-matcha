/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.rs                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/06/21 15:55:12 by fclivaz           #+#    #+#             */
/*   Updated: 2026/11/25 21:23:07 by fclivaz          ###   LAUSANNE.ch       */
/*                                                                            */
/* ************************************************************************** */

mod errors;
mod globals;
mod routes;
use axum::{
	Router,
	http::Request,
	middleware::{self, Next},
	response::Response,
};
use std::{
	error::Error,
	time::{Instant, SystemTime},
};
use time::{OffsetDateTime, macros::format_description};
use tokio::signal;
use userlib::caches::{UserCache, create_cache};

async fn verbose_logger(req: Request<axum::body::Body>, next: Next) -> Response
{
	let date: OffsetDateTime = SystemTime::now().into();
	let method = req.method().clone();
	let uri = req.uri().clone();
	println!(
		"[{}] -> [REQ] {} {}",
		date.format(format_description!(
			"[year]-[month]-[day] [hour]:[minute]:[second]"
		))
		.unwrap(),
		method,
		uri
	);
	let start = Instant::now();
	let res = next.run(req).await;
	let elapsed = start.elapsed();

	println!(
		"[{}] <- [RES] {} {} {} ({:?})",
		date.format(format_description!(
			"[year]-[month]-[day] [hour]:[minute]:[second]"
		))
		.unwrap(),
		res.status().as_u16(),
		res.status().canonical_reason().unwrap_or("?"),
		uri,
		elapsed
	);

	res
}

/// Starts the Matcha backend!
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>>
{
	let datacache: UserCache = create_cache();

	let app: Router = Router::new()
		.nest(globals::API_V1, routes::get_routes())
		.nest(globals::API_V1, routes::post_routes())
		.with_state(datacache)
		.layer(middleware::from_fn(verbose_logger));

	let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;

	let ctrl_c_handler = async {
		signal::ctrl_c().await.expect("Could not bind to sigint.");
	};

	axum::serve(listener, app)
		.with_graceful_shutdown(ctrl_c_handler)
		.await?;
	Ok(())
}
