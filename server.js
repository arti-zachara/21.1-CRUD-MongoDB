const mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  PORT = process.env.PORT || 5000;

// --- hello wolrld to be displayed on heroku
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// --- use native promise in Node (default mpromise deprecated)
mongoose.Promise = global.Promise;

// ---to be able to use a database created in MongoDB shell ----------------------
// new parser and different settings to het rid of deprecation problem
mongoose.connect(
  "mongodb+srv://artiZachara:Kod%21llaUserFr33@cluster0-ei5ms.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

// --- CRUD: C: Create users ------------------------------------------------------
// --- Schema to map to MongoDB collection ----------------------------------------
const Schema = mongoose.Schema;

// --- to create new users' models
const userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  created_at: Date,
  updated_at: Date
});

// --- method to modify name when creating user instance
userSchema.methods.manify = function(next) {
  this.name = this.name + "-boy";

  return next(null, this.name);
};

// --- execute before saving
userSchema.pre("save", function(next) {
  const currentDate = new Date();
  this.updated_at = currentDate;

  if (!this.created_at) {
    this.created_at = currentDate;
  }
  // go to next hook to be executed before or after the request
  next();
});

// -- user model based on the userSchema, to create new users -----------------
const User = mongoose.model("User", userSchema);

// --- User instances ---------------------------------------------------------

const kenny = new User({
  name: "Kenny",
  username: "Kenny_the_boy",
  password: "password"
});
// --- call methods:
kenny.manify(function(err, name) {
  if (err) throw err;
  console.log("Twoje nowe imię to: " + name);
});

// kenny.save(function(err) {
//   if (err) throw err;

//   console.log("Uzytkownik " + kenny.name + " zapisany pomyslnie");
// });

const benny = new User({
  name: "Benny",
  username: "Benny_the_boy",
  password: "password"
});

benny.manify(function(err, name) {
  if (err) throw err;
  console.log("Twoje nowe imię to: " + name);
});

// benny.save(function(err) {
//   if (err) throw err;

//   console.log("Uzytkownik " + benny.name + " zapisany pomyslnie");
// });

const mark = new User({
  name: "Mark",
  username: "Mark_the_boy",
  password: "password"
});

mark.manify(function(err, name) {
  if (err) throw err;
  console.log("Twoje nowe imię to: " + name);
});

// mark.save(function(err) {
//   if (err) throw err;

//   console.log("Uzytkownik " + mark.name + " zapisany pomyslnie");
// });

// --- CRUD: R: find users ---------------------------------------------------
// --- find all users
const findAllUsers = function() {
  return User.find({}, function(err, res) {
    if (err) throw err;
    console.log("Actual database records are " + res);
  });
};

// --- find specific user
const findUser = function() {
  return User.find({ username: "Kenny_the_boy" }, function(err, res) {
    if (err) throw err;
    console.log("Record you are looking for is " + res);
  });
};

// --- CRUD: U: update user's details ---------------------------------------------------
// --- update user password
const updadeUserPassword = function() {
  return User.findOne({ username: "Kenny_the_boy" }).then(function(user) {
    console.log("Old password is " + user.password);
    console.log("Name " + user.name);
    user.password = "newPassword";
    console.log("New password is " + user.password);
    return user.save(function(err) {
      if (err) throw err;

      console.log(
        "Uzytkownik " + user.name + " zostal pomyslnie zaktualizowany"
      );
    });
  });
};
// --- update user name
const updateUsername = function() {
  // update username
  return User.findOneAndUpdate(
    { username: "Benny_the_boy" },
    { username: "Benny_the_man" },
    { new: true },
    function(err, user) {
      if (err) throw err;

      console.log("Nazwa uzytkownika po aktualizacji to " + user.username);
    }
  );
};

// --- CRUD: D: delete user ---------------------------------------------------
// find specific user: Mark and delete
const findMarkAndDelete = function() {
  return User.findOne({ username: "Mark_the_boy" }).then(function(user) {
    return user.remove(function() {
      console.log("User successfully deleted");
    });
  });
};
// find specific user: Kenny and delete
const findKennyAndDelete = function() {
  return User.findOne({ username: "Kenny_the_boy" }).then(function(user) {
    return user.remove(function() {
      console.log("User successfully deleted");
    });
  });
};
// find specific user: Benny and delete
const findBennyAndRemove = function() {
  return User.findOneAndRemove({ username: "Benny_the_man" }).then(function(
    user
  ) {
    return user.remove(function() {
      console.log("User successfully deleted");
    });
  });
};
// -- deal with diuplicate records -------------------------------------------
Promise.all([kenny.save(), mark.save(), benny.save()])
  .then(findAllUsers)
  .then(findUser)
  .then(updadeUserPassword)
  .then(updateUsername)
  .then(findMarkAndDelete)
  .then(findKennyAndDelete)
  .then(findBennyAndRemove)
  .catch(console.log.bind(console));
