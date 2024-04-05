const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model(
    "User", 
    new Schema({
      username: {type: String, required: true},
      password: {type: String, required: true},
      admin: {type: Boolean}
    })
  );

module.exports = User;