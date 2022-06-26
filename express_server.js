//import external modules
const express = require("express");
const bodyParser = require("body-parser");
app = express();
PORT = 8080;
app.set("view engine", "ejs"); //set the ejs as view engine
app.use(bodyParser.urlencoded({ extended: true }));

function generateRandomString() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charlen = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charlen));
  }
  return result;
} // generate random number

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
}); // this will turns the object into json file

app.get("/", (req, res) => {
  res.send("Hello!");
}); //set the main tag

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
}); //set the hello tag

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
}); //set the urls tag and have the ejs render in the views folder

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
}); // generate a new short URL from a long URL

app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
}); // redirect to the longURL page using shortURL

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
}); //Use Javascript's delete operator to remove the URL

app.listen(PORT, () => {
  console.log("Server is listening on PORT: ", PORT);
}); // start the server and listen to the PORT we set as 8080
