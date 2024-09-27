//importing dependencies
const express = require('express');
const app = express();
const dotenv=require('dotenv');
const mysql=require('mysql2');

//configure environment variables
dotenv.config();
app.use(express.json());


// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if(err){ return console.log("Error connecting to the database",err);
         }
            console.log("Connected to sql successfully Thread ID: ",db.threadId);
          });

// Question 1 goes here
app.get('/patients', (req, res) => {
  const getPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

  db.query(getPatients, (err, data) => {
    if (err) {
      return res.status(400).send('Error retrieving patients: ' + err);
    }
    res.status(200).json(data); 
  });
});

// Question 2: Get all providers
app.get('/providers', (req, res) => {
  console.log("Received request to retrieve all providers");
  const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers';
  
  db.query(getProviders, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving providers: '+ err });
    }
    console.log('Retrieved providers:', results);
    res.json(results);
  });
});

// Question 3 goes here
app.get('/patients/filter/:firstName', (req, res) => {
  const { firstName } = req.params;
  console.log(`Received request to filter patients by first name: ${firstName}`);
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  
  db.query(query, [firstName], (err, results) => {
    if (err) {
      console.error('Error retrieving patients:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    console.log('Retrieved filtered patients:', results);
    res.json(results);
  });
});

// Question 4 goes here
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  console.log(`Received request to retrieve providers by specialty: ${specialty}`);
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  
  db.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('Error retrieving providers:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    console.log('Retrieved providers by specialty:', results);
    res.json(results);
  });
});


// listen to the server
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`)
});
