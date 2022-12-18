const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//----------------------------------------------------------------------

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required !"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Email is required !"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Provide valid email adress !",
    ],
    unique: [true, "This email is already in use !"],
  },
  password: {
    type: String,
    required: [true, "Password is required !"],
    minlength: 6,
  },
});

//------------------------------------------
UserSchema.pre("save", async function () {
  const salt = await bcryptjs.genSalt(11);
  this.password = await bcryptjs.hash(this.password, salt);
});

//------------------------------------------
UserSchema.methods.getName = function () {
  return this.name;
};

//------------------------------------------
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME },
  );
};

//------------------------------------------
UserSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

/* OK */
// UserSchema.methods.comparePassword = function (password) {
//   const isMatched = bcryptjs.compare(password, this.password);
//   return isMatched;
// };

//------------------------------------------
module.exports = mongoose.model("User", UserSchema);
