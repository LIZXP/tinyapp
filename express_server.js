const express = require("express");
app = express();
PORT = 8080;
app.set("view engine", "ejs"); //set the ejs as view engine

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
}); //set the main tag

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
}); // this will turns the object into json file

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
}); //set the hello tag

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
}); //set the urls tag and have the ejs render in the views folder

app.listen(PORT, () => {
  console.log("Server is listening on PORT: ", PORT);
}); // start the server and listen to the PORT we set as 8080
