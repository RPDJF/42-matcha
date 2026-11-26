use crate::models::generic::ApiReqUser;

use super::*;
use std::error::Error;

// fn boilerplate(
// 	email: &str,
// 	password: &str,
// ) -> Result<
// 	models::generic::ApiReqUser,
// 	ErrorDetails<errors::GenericUserErrors, errors::ValidatorErrors>,
// >
// {
// 	let i = models::generic::ApiReqUser {
// 		email_address: String::from(email),
// 		password: String::from(password),
// 		birth_date: 12,
// 	};
// 	crate::creation::user::create_user(i)
// }

#[tokio::test]
async fn successful_user_creation() -> Result<(), Box<dyn Error>>
{
	let correct_pw = "Str0ngPassword!";
	let email = "jax@matcha.com";

	// let resp = boilerplate(email, correct_pw).expect("User creation failed.");
	// println!(
	// 	"Success! Email: {}, UUID: {}",
	// 	resp.email_address, resp.uuid
	// );
	Ok(())
}

#[tokio::test]
async fn double_email() -> Result<(), Box<dyn Error>>
{
	let correct_pw = "Str0ngPassword!";
	let email = "pomni@matcha.com";

	// let resp = boilerplate(email, correct_pw).expect("User creation failed.");
	// println!(
	// 	"Success! Email: {}, UUID: {}",
	// 	resp.email_address, resp.uuid
	// );
	//
	// match boilerplate(email, correct_pw) {
	// 	Ok(i) => panic!("Email {} was accepted!", i.email_address),
	// 	Err(i) => println!("Email {}: {} all good :)", email, i.error_code()),
	// }
	Ok(())
}

#[tokio::test]
async fn bad_emails() -> Result<(), String>
{
	let cache = caches::UserCache::new();
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
		"        jax@matcha._com",
		"jax@matcha.com         ",
		"        jax@matcha.com         ",
		"FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHH@matcha.com",
		"j@maaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaatcha.com",
	];

	for email in emails {
		match creation::user::generate_new_user(
			ApiReqUser {
				email_address: email.to_owned(),
				password: correct_pw.to_owned(),
				birth_date: 12,
			},
			&cache,
			"id",
		) {
			Ok(_i) => return Err(format!("Email {email} was found to be valid!")),
			Err(i) => println!("Email {}: {} all good :)", email, i.error_code()),
		}
	}
	Ok(())
}

#[tokio::test]
async fn bad_passwords() -> Result<(), String>
{
	let cache = caches::UserCache::new();
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

		match creation::user::generate_new_user(
			ApiReqUser {
				email_address: String::from(&email),
				password: password.to_owned(),
				birth_date: 12,
			},
			&cache,
			"id",
		) {
			Ok(_) => return Err(format!("Password {password} was found to be valid!")),
			Err(i) => println!("Password {password}: {} all good :)", i.error_code()),
		}
	}
	Ok(())
}
