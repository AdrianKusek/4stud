const User = require("../models/user");
const Channel = require("../models/chat/channel");
const Message = require("../models/chat/message");
const Add = require("../models/add");
const {
  countConsecutiveMessages,
} = require("../utils/countConsecutiveMessages");

module.exports.makeNewChannel2 = async (req, res) => {};

module.exports.makeNewChannal = async (req, res) => {
  const id = req.params.id;
  const addCreator = await User.findById(id);
  // console.log(addCreator);
  const messageSender = await User.findById(req.user._id);
  console.log(messageSender.username);
  console.log(addCreator.username);
  let channel;
  channel = await Channel.find({
    user1: addCreator.username,
    user2: messageSender.username,
  });
  if (channel.length === 0) {
    channel = new Channel({
      user1: addCreator.username,
      user2: messageSender.username,
    });
    addCreator.chatChannels.push(channel._id);
    messageSender.chatChannels.push(channel._id);
    channel.save();
    addCreator.save();
    messageSender.save();
  }

  res.redirect("/chat");
};

module.exports.makeeNewChannal = async (req, res) => {
  const authorID = req.body.authorID;
  console.log(authorID, "authorID");

  const messageSender = await User.findById(req.user._id);
  const addCreator = await User.findById(authorID);

  let channel;
  channel = await Channel.find({
    user1: addCreator.username,
    user2: messageSender.username,
  });
  if (channel.length) {
    res.redirect(`/chat/${channel[0].id}`);
  } else {
    if (channel.length === 0) {
      console.log("making new channel");
      channel = new Channel({
        user1: addCreator.username,
        user2: messageSender.username,
      });
      console.log(channel, "channelmade");
      addCreator.chatChannels.push(channel._id);
      messageSender.chatChannels.push(channel._id);
      channel.save();
      addCreator.save();
      messageSender.save();
    }

    console.log(channel.id, "chanel");

    res.redirect(`/chat/${channel.id}`);
  }
};

module.exports.sendMessage = async (req, res) => {
  const id = req.params.id;
  const { body } = req.body.message;
  const channel = await Channel.findById(id);
 
  const messageSender = await User.findById(req.user._id);
  await req.user.populate("chatChannels");
  const newMessage = new Message({
    body: body,
    channel: channel,
    sender: messageSender.username,
    date: Date(),
  });
  await newMessage.save();
  channel.messages.push(newMessage);

  await channel.populate("messages");

 
  channel.consecutiveMsg = countConsecutiveMessages(channel.messages);

  await channel.save();

 
  res.redirect(`/chat/${id}`);
};

module.exports.renderChat = async (req, res) => {
  const activeChannel = req.params.id;

  const user = await User.findById(req.user._id);
  await user.populate("chatChannels");
  for (let channel of user.chatChannels) {
    await channel.populate("messages");
  }
 

  for (let channel of user.chatChannels) {
  }

  res.render("chat/index", { user, activeChannel });
};
