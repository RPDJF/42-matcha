use crate::{
	globals,
	routes::{self, auth::register::register},
};
use axum::{
	Router,
	body::Body,
	http::{Method, Request, StatusCode},
};
use axum_test::TestServer;
use sea_orm::{Database, DatabaseConnection, sea_query::value::prelude::serde_json};
use std::error::Error;
use userlib::models::generic::ApiReqUser;

static CONNECTION_STRING: &str = "sqlite://./webapi_tests.db?mode=rwc";
// static CONNECTION_STRING: &str = "sqlite::memory:";

#[tokio::test]
async fn successful_user_creation() -> Result<(), Box<dyn Error>>
{
	let db: DatabaseConnection = Database::connect(CONNECTION_STRING).await?;
	let _f = db.get_schema_registry("userlib::models::*").sync(&db).await;
	let correct_pw = String::from("Str0ngPassword!");
	let email = String::from("jax@matcha.com");
	let f = ApiReqUser {
		email_address: email,
		password: correct_pw,
	};
	let app = Router::new()
		.nest(globals::API_V1, routes::get_routes())
		.nest(globals::API_V1, routes::post_routes())
		.with_state(db);

	let server = TestServer::new(app);

	let resp = server
		.post("/api/v1/auth/register")
		.json(&serde_json::json!(f))
		.await;

	resp.assert_status(StatusCode::ACCEPTED);

	Ok(())
}
