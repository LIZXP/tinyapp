// generate random number
function generateRandomString() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charlen = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charlen));
  }
  return result;
}

const urlsForUser = (id, database) => {
  let userUrls = {};
  for (const url in database) {
    if (id === database[url].userID) {
      userUrls[url] = database[url];
    }
  }
  return userUrls;
};

const getUserByEmail = function (email, database) {
  let user;
  for (const ids in database) {
    user = database[ids].email;
  }
  return user;
};

module.exports = { generateRandomString, urlsForUser, getUserByEmail };
