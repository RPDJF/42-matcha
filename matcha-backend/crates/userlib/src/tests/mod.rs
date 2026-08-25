#[cfg(test)]
use sea_orm::{Database, DatabaseConnection, sqlx::Connection};
use std::error::Error;

fn boilerplate(
	email: &str,
	password: &str,
) -> Result<crate::models::generic::ApiRespBasicUser, crate::errors::ErrorDetails>
{
	let i = crate::models::generic::ApiReqUser {
		email_address: String::from(email),
		password: String::from(password),
	};
	crate::creation::user::create_user(i)
}

#[tokio::test]
async fn successful_user_creation() -> Result<(), Box<dyn Error>>
{
	let db: DatabaseConnection = Database::connect("sqlite::memory:").await?;
	let correct_pw = "Str0ngPassword!";
	let email = "jax@matcha.com";

	let resp = boilerplate(email, correct_pw).expect("User creation failed.");
	println!(
		"Success! Email: {}, UUID: {}",
		resp.email_address, resp.uuid
	);
	Ok(())
}

#[tokio::test]
async fn double_email() -> Result<(), Box<dyn Error>>
{
	let db: DatabaseConnection = Database::connect("sqlite::memory:").await?;
	let correct_pw = "Str0ngPassword!";
	let email = "pomni@matcha.com";

	let resp = boilerplate(email, correct_pw).expect("User creation failed.");
	println!(
		"Success! Email: {}, UUID: {}",
		resp.email_address, resp.uuid
	);

	match boilerplate(email, correct_pw) {
		Ok(i) => panic!("Email {} was accepted!", i.email_address),
		Err(i) => println!("Email {}: {} all good :)", email, i.error_code()),
	}
	Ok(())
}

#[tokio::test]
async fn bad_emails() -> Result<(), Box<dyn Error>>
{
	let db: DatabaseConnection = Database::connect("sqlite::memory:").await?;

	let correct_pw = "Str0ngPassword!";
	let emails = [
		"",
		"           ",
		"jax@matchacom",
		"jax@matcha.",
		"...@matcha.com",
		"i/dont^really&know!bro@matcha.com",
		"jax@matcha_com.com...com",
		"jax@matcha.com_",
		"jax@matcha._com",
		"FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHH@matcha.com",
		"j@maaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaatcha.com",
	];

	for email in emails {
		match boilerplate(email, correct_pw) {
			Ok(i) => panic!("Email {} was found to be valid!", i.email_address),
			Err(i) => println!("Email {}: {} all good :)", email, i.error_code()),
		}
	}
	Ok(())
}

#[tokio::test]
async fn bad_passwords() -> Result<(), Box<dyn Error>>
{
	let db: DatabaseConnection = Database::connect("sqlite::memory:").await?;

	let passwords = [
		"",
		"weak",
		"Aa1!",
		"                ",
		"fahahahahahahahahhahahahaha",
		"012083018723012{}}{}{!{!@{}>!<@}}",
		"AAAAAAAAAAAAAAAAAAAAAaaaaaaa!",
		"AAAAAAAAAAAAAAAAAAAAAaaaaaaa912731892678712",
		"AAAAAAAAAAAAAAAAAAAAAaaaaaaa!",
	];
	let mut email = String::from("caine@matcha.com");

	for password in passwords {
		email += "m";
		match boilerplate(&email, password) {
			Ok(_) => panic!("Password {} was found to be valid!", password),
			Err(i) => println!("Password {}: {} all good :)", password, i.error_code()),
		}
	}
	Ok(())
}
