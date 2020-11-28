// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function foodDataFetcher() {
	const url = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
	const data_file = await fetch(url);
	return data_file.json();
}
function dataInput(item, datab) {
	const name = item.name;
  const category = item.category;
  const inspection_date = item.inspection_date;
  const inspection_results = item.inspection_results;
  const city = item.city;
  const state = item.state;
  const zip = item.zip;
  const owner = item.owner;
  const type = item.type;
  let fields = [name, category, inspection_date, inspection_results, city, state, zip, owner, type];
  datab.exec(`INSERT INTO food (fields) VALUES ("${name}", "${category}", "${inspection_date}", 
          "${inspection_results}", ${city}", "${state}", "${zip}", "${owner}", ${type}")`);
}
async function databaseInitialize(dbSettings) {
  const db = await open(dbSettings);
  db.exec(`CREATE TABLE IF NOT EXISTS food (id INTEGER PRIMARY KEY AUTOINCREMENT, 
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
  try {
    const fdata = await foodDataFetcher();
    fdata.forEach((entry) => dataInput(entry, db));
    const test = await db.get("SELECT * FROM food");
    console.log(test);
  } catch (e) {
    console.log("Error loading database");
    console.log(e);
	}
}

async function databaseRetriever(db) {
  const result = await db.all(`SELECT category, COUNT(name) FROM food GROUP BY category`);
  return result;
}


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const app = express();
const port = process.env.PORT || 3000;
const dbSettings = { filename: './tmp/database.db', driver: sqlite3.Database};

dotenv.config();

app.route('/sql')
  .get(async(req, res) => {
    console.log('GET detected');
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);
    const json = await databaseRetriever(db);
    console.log('fetch request data', json);
    res.send(json);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
