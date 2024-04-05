// messages.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    username: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference the "User" model
    message: { type: String, required: true, max: 1000 },
    timestamp: { type: Date, default: Date.now } // Add a default value for timestamp
});

const Message = mongoose.model("Message", messageSchema); // Renamed the model to "Message"

module.exports = Message;
