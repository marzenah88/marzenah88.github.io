// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const dbSettings = { filename: './tmp/database.db', driver: sqlite3.Database};

async function foodDataFetcher() {
	const url = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
	const data_file = await fetch(url);
	return data_file.json();
}

async function dataInput(dbItem) {
	const name = dbItem.name;
  const category = dbItem.category;
  const inspection_date = dbItem.inspection_date;
  const inspection_results = dbItem.inspection_results;
  const city = dbItem.city;
  const state = dbItem.state;
  const zip = dbItem.zip;
  const owner = item.owner;
  const type = dbItem.type;
  let fields = [name, category, inspection_date, inspection_results, city, state, zip, owner, type];
  datab.exec(`INSERT INTO food (fields) VALUES ("${name}", "${category}", "${inspection_date}", 
          "${inspection_results}", ${city}", "${state}", "${zip}", "${owner}", ${type}")`);
}

async function databaseInitialize(dbSet) {
	try {
		const db = await open(dbSet);
		await db.exec(`CREATE TABLE IF NOT EXISTS food (id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT,
      category TEXT,
      inspection_date DATE,
      inspection_results TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      owner TEXT,
      type TEXT 
    )
  `);
		const data = await foodDataFetcher();
		data.forEach((entry) => { dataInput(entry) });
	}
	catch(e) {
		console.log("Error loading Database");
		console.log(e);
	}
}

async function dataRetriever() {
  
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.route('/api')
  .get(async (req, res) => {
    console.log('GET request detected');
    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    console.log('data from fetch', json);
    res.json(json);
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);
    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    databaseInitialize(dbSettings);
    res.json(json);
  });
  app.route('/sql')
  .get(async (req, res) => {
    console.log('GET request detected');
    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    console.log('data from fetch', json);
    res.json(json);
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);
    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    databaseInitialize(dbSettings);
    res.json(json);
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
