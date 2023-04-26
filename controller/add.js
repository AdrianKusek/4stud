const User = require("../models/user");
const Add = require("../models/add");
const Channel = require("../models/chat/channel");
const Message = require("../models/chat/message");
const { cloudinary } = require("../cloudinary");
const dogBreeds = require("../utils/dogBreeds");
/////MAPBOX
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
const { isWithinRadius } = require("../utils/calcCoordinatesDistance");

////END OF MAPBOX

module.exports.renderNewAddForm = (req, res) => {
  res.render("adds/new", { dogBreeds });
};

module.exports.showAllAdds = async (req, res) => {
  // await Add.deleteMany({});
  // await User.deleteMany({});
  // await Channel.deleteMany({});
  // await Message.deleteMany({});

  // const a = await Add.find();
  // const b = await User.find();
  // const c = await Channel.find();
  // const d = await Message.find();

  const adds = await Add.find().populate("author");
  ////Calculating number of adds of user not needed here
  // for (let add of adds) {
  //   const user = await User.findById(add.author._id);
  //   const addAmount = user.adds.length;
  //   add.authorAdds = addAmount;
  //   add.save();
  // }

  // adds.forEach((e) => {
  //   e.city = "Newport";
  //   e.save();
  // });

  ///End of calculating numer of adds

  res.render("adds/index", { adds });
};
module.exports.showOneAdd = async (req, res) => {
  const id = req.params.id;
  const add = await Add.findById(id).populate("author");
  const addCreator = await User.findById(add.author._id);
  const userAdds = addCreator.adds.length;
  const user = await User.findById(req.user);

  res.render("adds/show", { add, user, userAdds });
};

module.exports.renderSearch = async (req, res) => {
  const user = await User.findById(req.user);

  let p1 = req.query;
  let { age, city, radius } = req.query;

  if (age) {
    let ageArr = Array.from(age);

    if (ageArr.length === 1) {
      ageArr.forEach((e) => {
        e = parseInt(e);
        if (e === 1) {
          req.query.age = { $lte: 2 };
        }
        if (e === 2) {
          req.query.age = { $gt: 2, $lte: 5 };
        }
        if (e === 3) {
          req.query.age = { $gt: 5 };
        }
      });
    }
    if (ageArr.length === 2) {
      let sum = 0;

      ageArr.forEach((e) => {
        sum += parseInt(e);
      });

      if (sum === 3) {
        req.query.age = { $lte: 5 };
      }
      if (sum === 4) {
        delete req.query.age;
        req.query.$or = [{ age: { $lte: 2 } }, { age: { $gt: 5 } }];
      }

      if (sum === 5) {
        req.query.age = { $gte: 3 };
      }
    }
    if (ageArr.length === 3) {
      delete req.query.age;
    }
  }

  // if (parseInt(age) === 1) {
  //   req.query.age = { $lte: 2 };
  // }
  // if (parseInt(age) === 2) {
  //   req.query.age = { $gt: 2, $lt: 5 };
  // }
  // if (parseInt(age) === 3) {
  //   req.query.age = { $gte: 5 };
  // }
  delete req.query.city;
  // req.query.age = ageQuery;
  // let qStr = JSON.parse(req.query);
  // await Add.findByIdAndDelete("62cf0f0005ecc058b7a4a4fa");

  let add = await Add.find(req.query).populate("author");

  let addTest = await Add.find({
    $or: [{ age: { $lte: 2 } }, { age: { $gte: 5 } }],
  });

  if (city) {
    city = city.split(",");

    if (!radius) {
      radius = 10; ///within a city assumses that average city is 10km radius
    } else {
      radius = parseInt(radius) + 10; //to include additional radius within a city
    }

    const long = city[2];
    const lat = city[1];

    add = add.filter((e) => {
      return e.retlat(lat, long, radius);
    });
  }

  res.render("adds/search", { dogBreeds, city, add, user });
};
module.exports.searchAdds = async (req, res) => {
  // const id = req.params.id;

  const searchCriteria = req.body;

  res.send("yo");
};

module.exports.createAdd = async (req, res) => {
  const query = `${req.body.add.address} ${req.body.add.city} ${req.body.add.postcode}`;
  const geoData = await geoCoder
    .forwardGeocode({
      query: query,
      limit: 1,
    })
    .send();
  const add = new Add(req.body.add);
  add.geometry = geoData.body.features[0].geometry;

  add.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  add.city = req.body.add.city;
  add.author = req.user._id;
  const user = await User.findById(req.user._id);

  user.adds.push(add._id);

  await add.save();
  await user.save();

  res.redirect(`/adds/${add._id}`);
};

module.exports.like = async (req, res) => {
  const id = req.params.id;
  const add = await Add.findById(id);
  const user = await User.findById(req.user._id);

  add.likes.push(req.user._id);
  user.likedAdds.push(id);
  await add.save();
  await user.save();

  res.redirect(`/adds/${id}`);
};
module.exports.unlike = async (req, res) => {
  const id = req.params.id;
  const add = await Add.findById(id);
  const user = await User.findById(req.user._id);

  add.likes.pull(req.user._id);
  user.likedAdds.pull(id);
  await add.save();
  await user.save();

  res.redirect(`/adds/${id}`);
};
