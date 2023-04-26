const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../user");
const Message = require("../chat/message");
const Add = require("../add");

const channelSchema = new Schema({
  user1: String,
  user2: String,
  title: String,

  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  consecutiveMsg: Array,
});

module.exports = mongoose.model("Channel", channelSchema);
