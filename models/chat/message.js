const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../user");
const Message = require("../chat/channel");

const messageSchema = new Schema({
  body: String,

  channel: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
  },
  sender: String,
  date: Object,

  // sender: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
  // reciver: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
});

module.exports = mongoose.model("Message", messageSchema);
