//import express f/w
const { error } = require("console");
const express = require("express");
const { request } = require("http");
//import cors for fetching data
const cors = require("cors");
//import mysql
const mysql = require("mysql2");
// make instanceof express app
const app = express();
//use parse
app.use(express.json()); // Parse JSON request bodies

//use cors to allow fE BE to communicate
app.use(
  cors({
    origin: "http://localhost:4200", // Replace with the origin of your Angular app
  })
);
// add port
const port = process.env.PORT || 3000;

//add connection const for connectiong myslq
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rshubham@13",
  database: "note_db",
});

//connect to databse
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to the database: " + error.stack);
    return;
  } else {
    console.log("Connected to the database as ID " + connection.threadId);
  }
});

// addding routes
//1. for getting all the notes
app.get("/notes", (request, response) => {
  connection.query("SELECT * FROM notes", (error, results) => {
    if (error) {
      console.log("error connecting database");
      return response.status(500);
    } else {
      response.json(results);
      //   console.log(response);
    }
  });
});

//2.adding the post

app.post("/notes", (request, response) => {
  const { note_title, note_description } = request.body;

  connection.query(
    "INSERT INTO notes (note_title,note_description)VALUES (?,?)",
    [note_title, note_description],
    (error, results) => {
      if (error) {
        console.error("Error creating a new note: " + err.stack);
        return res.status(500).json({ error: "Database error" });
      } else {
        const createNote = {
          note_id: results.insertId,
          note_title,
          note_description,
        };
        response.status(201).json(createNote);
      }
    }
  );
});

//3.delete function
app.delete('/notes/:note_id', (request, response) => {
    const note_id = request.params.note_id;
  
    connection.query(
      'DELETE FROM notes WHERE note_id = ?',
      [note_id],
      (err, result) => {
        if (err) {
          console.error('Error deleting the note: ' + err.stack);
          return response.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
          return response.status(404).json({ error: 'Note not found' });
        }
        response.status(200).json({ message: 'Note deleted successfully' });
      }
    );
  });
  
//close connecction
process.on("exit", () => {
  connection.end();
});

// add listener

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
