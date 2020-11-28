// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
const port = process.env.PORT || 3000;
const dbSettings = { filename: './tmp/database.db', driver: sqlite3.Database};
async function foodDataFetcher() {
	const url = "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json";
	const response = await fetch(url);
	return response.json()
}
async function dataItemInput(data) {
	try {
    fields = [name, category, inspection_date, inspection_results, city, state, zip, owner, type]
		const name = data.name;
    const category = data.category;
    
		await db.exec(`INSERT INTO food (fields) VALUES ("${restaurant_name}", "${category}")`);
		console.log(`${restaurant_name} and ${category} inserted`);
		}
  catch(e) {
		console.log('Error on insertion');
		console.log(e);
		}

}
async function databaseInitialize(dbSettings) {
	const db = await open(dbSettings);
		await db.exec(`CREATE TABLE IF NOT EXISTS food (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
    category TEXT,
    inspection_date DATE,
    inspection_results TEXT,
    city TEXT,
    state TEXT,
    zip INTEGER,
    owner TEXT,
    type TEXT
    )`)
}
  try {
		const data = await foodDataFetcher();
		data.forEach((entry) => { itemInput(entry) });
		const test = await db.get("SELECT * FROM restaurants")
		console.log(test);

	}
	catch(e) {
		console.log("Error loading Database");
		console.log(e);

	}
}

dotenv.config();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.route('/sql')
  .get(async(req, res) => {
    console.log('GET detected');
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);
    const output = databaseInitialize(dbSettings) 
    console.log('data from fetch', JSON);
    res.SQL(output);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
