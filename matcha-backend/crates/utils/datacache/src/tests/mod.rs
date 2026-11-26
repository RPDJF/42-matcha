use std::{thread::sleep, time::Duration};

use super::*;

#[derive(Clone)]
struct User
{
	pub name: &'static str,
	pub age: i32,
}

#[test]
fn insert_in_map()
{
	let cache = DataCache::new();
	let user = User {
		name: "John",
		age: 69,
	};
	let key = String::from("Hi");
	cache
		.insert(&key, &user, (None, None, Some(Seconds(10))))
		.unwrap();

	let ret = cache.get(&key).unwrap();

	assert_eq!(ret.name, "John");
	assert_eq!(ret.age, 69);
}

#[test]
fn get_with_wrong_key() -> Result<(), String>
{
	let cache = DataCache::new();
	let user = User {
		name: "John",
		age: 69,
	};
	let key = String::from("Hi");
	let wrkey = String::from("Ho");

	cache
		.insert(&key, &user, (None, None, Some(Seconds(10))))
		.unwrap();

	let ret = cache.get(&wrkey);
	match ret {
		Ok(_) => return Err(String::from("Error! Got data back!")),
		Err(_) => println!("Missed user, good."),
	}
	Ok(())
}

#[test]
fn your_taking_too_long() -> Result<(), String>
{
	let cache = DataCache::new();
	let user = User {
		name: "John",
		age: 69,
	};
	let key = String::from("Hi");

	cache
		.insert(&key, &user, (None, None, Some(Seconds(0))))
		.unwrap();

	let duration = Duration::new(1, 0);
	sleep(duration);

	let ret = cache.get(&key);
	match ret {
		Ok(_) => return Err(String::from("Error! Got data back!")),
		Err(_) => println!("Missed user, good."),
	}
	Ok(())
}
