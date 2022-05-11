const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

//---------------------------------------Validadtor------------------------------------------
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value != "string" || value.trim().length == 0) return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObject = function (object) {
  return Object.keys(object).length == 3;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

//-----------------------------------Validator----------------------------------------------------

const createUser = async function (req, res) {
  try {
    let requestBody = req.body;
    const { title, name, phone, email, password, address } = requestBody;

    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, msg: "Please provide details of the User" });
    }
    if (!isValid(title)) {
      res.status(400).send({status: false, msg: 'Enter appropriate title ex. "Mr", "Mrs","Miss"'});
    }
    if (!isValid(name)) {
      res.status(400).send({ status: false, msg: "Enter appropriate name of user  " });
    }
    if (!isValid(phone)) {
      res.status(400).send({ status: false, msg: "Enter appropriate phone no." });
    }
    if (!isValid(email)) {
      res.status(400).send({ status: false, msg: "Enter appropriate email" });
    }
    if (!isValid(password)) {
      res.status(400).send({ status: false, msg: "Enter appropriate password" });
    }
    if (!isValidObject(address)) {
      res.status(400).send({status: false, msg: "Enter appropriate address with street,city,pincode"});
    }
    if (!isValid(address.street)) {
      res.status(400).send({ status: false, msg: "Enter appropriate street" });
    }
    if (!isValid(address.city)) {
      res.status(400).send({ status: false, msg: "Enter appropriate city" });
    }
    if (!isValid(address.pincode)) {
      res.status(400).send({ status: false, msg: "Enter appropriate pincode" });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      res.status(400).send({ status: false, msg: "Please enter valid email Id" });
    }

    if (!(phone.length == 10)) {
      res.status(400).send({ status: false, msg: "Enter 10 digit mobile no." });
    }

    if (!isValid(password)) {
      res.status(400).send({ status: false, msg: "Enter appropriate password" });
    }

    const isEmailAlreadyUsed = await userModel.findOne({ email });
    if (isEmailAlreadyUsed) {
      res.status(400).send({ status: false, msg: "Email Address already registered" });
    }

    const userData = { title, name, phone, email, password, address };
    const newUser = await userModel.create(userData);
    return res.status(201).send({ status: true, data: newUser });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////

const userLogin = async function (req, res) {
  try {
    let userDetails = req.body;
    let user = await userModel.findOne(userDetails);
    if (!user) {
      return res
        .status(404)
        .send({ status: false, msg: "Invalid email or Password" });
    }
    let token = jwt.sign(
      {
        userId: user._id,
        iat: Date.now(), // iat (issued at) claim identifies the time at which the JWT was issued.
        exp: 60 * 60, //exp claim identifies the expiration time in sec on or after which the JWT will be expired.
      },
      "Project3"
    );

    res.status(200).send({ status: true, msg: token });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
    console.log(error.message);
  }
};

module.exports = { userLogin, createUser };
