const md = require('markdown').markdown;
const express = require('express')
const app = express()
const fs = require('fs');
const port = 8080

var teamProcess = require('./team.js');

// faq variables
const faqPath = __dirname + '/data/faq.md';
var faq = {}

// team variables
var team = require( __dirname + '/data/team.json');
var sponsors = require( __dirname + '/data/sponsors.json');

// parse the faq into json.
fs.readFile(faqPath, function (err, data) {
  if (err) {
    throw err;
  }
  var parsed = md.parse(data.toString());

  // parse the faq markdown into a json.
  var tail;
  for (var i = 1; i < parsed.length; i++) {
    var entry = parsed[i];
    if (entry[0] == "header") {
      tail = entry[2];
    } else {
      faq[tail] = md.toHTML(entry);
    }
  }
});

app.use("/", express.static(__dirname + '/public/'));

// faq json
app.get('/faq', (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.send(faq)
});

// team json
app.get('/team', (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.send(team)
});

// sponsor json
app.get('/sponsors', (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.send(sponsors)
});

app.get('/codeofconduct', (request, response) => {
  response.redirect('/dh18_code_of_conduct.pdf');
});

app.get('/sponsorsurvey', (request, response) => {
  response.redirect('https://ducompsoc.typeform.com/to/wKF4ij');
});

app.get('/jointheteam', (request, response) => {
    response.redirect('/');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', (request, response) => {
  response.status(404).sendFile(__dirname + '/public/404.html');
});

app.listen(port, (err) => {
  if (err) {
    // return response to user..
    return console.log('something bad happened', err)
  }

  console.log('################################################');
  console.log(`# SUCCESS: Server is now listening on port ${port}.`);
  console.log('################################################');
});