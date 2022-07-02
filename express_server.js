//import external modules
const {
  generateRandomString,
  urlsForUser,
  getUserByEmail,
} = require("./helpers");
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
app = express();
PORT = 8080;
app.set("view engine", "ejs"); //set the ejs as view engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["supergoodsite"],
  })
);
//create empty object acting like date base to store the users information
const users = {};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
// GET

// this will turns the object into json file
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//set the main tag
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.userID],
  };
  res.render("urls_register", templateVars);
});
//set the urls tag and have the ejs render in the views folder
app.get("/urls", (req, res) => {
  const userUrls = urlsForUser(req.session.userID, urlDatabase);
  const templateVars = {
    urls: userUrls,
    user: users[req.session.userID],
  };
  if (!req.session.userID) {
    res.redirect("/login");
  } else {
    res.render("urls_index", templateVars);
  }
});

// generate a new short URL from a long URL
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.userID] };
  if (!req.session.userID) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL].longURL;
  // redirect to the longURL page using shortURL
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.session.userID],
  };
  res.render("urls_show", templateVars);
});

//anything else page request is redirct to main page
app.get("*", (req, res) => {
  res.redirect("/urls");
});

//POST
app.post("/login", (req, res) => {
  // destructure the email and password from req.body
  const { email, password } = req.body;
  if (email === "" || password === "") {
    return res.status(400).send("Please enter valid values!");
  }
  let foundUser;
  // loop through the users object and find if there is value
  for (const userId in users) {
    if (users[userId].email === email) {
      foundUser = users[userId];
    }
  }
  // if the no email found then we send 400 status code
  if (!foundUser) {
    return res.status(403).send("the user is not exists!");
  }
  // if password in users object is different than password enterd then show error
  else if (!bcrypt.compareSync(password, foundUser.password)) {
    return res.status(403).send("incorrect password!");
  }
  req.session.userID = foundUser.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.clearCookie("session.sig");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  // destructure the email and password from req.body
  const { email, password } = req.body;
  // add salt combind with bcrypt to make it more secure
  const salt = bcrypt.genSaltSync();
  const userEmail = getUserByEmail(email, users);
  if (email === "" || password === "") {
    return res.status(400).send("Please enter valid values!");
  }
  let foundUser;
  // loop through the users object and find if there is value
  for (const userId in users) {
    if (users[userId].email === email) {
      foundUser = users[userId];
    }
  }
  if (userEmail === email) {
    // if the same email found then we send 400 status code
    return res.status(400).send("the user is exists!");
  }
  // generate random id
  const id = generateRandomString();
  //put id email and password from POST request to an object
  const newUser = {
    id,
    email,
    //add hash to password using salt + bcrypt hash
    password: bcrypt.hashSync(password, salt),
  };
  // assigned a random id as key to the new object.
  users[id] = newUser;
  req.session.userID = id;
  res.redirect("urls");
});
// switch the new longURL fetched from req.body to replace the one in urlDatabase
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.userID;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect("/urls");
});
//edit function
app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  let longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls/");
});
//Use Javascript's delete operator to remove the URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});
// start the server and listen to the PORT we set as 8080
app.listen(PORT, () => {
  console.log("Server is listening on PORT: ", PORT);
});
