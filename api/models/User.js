const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      profilePic: { type: String, defaut: "" },
      isAdmin: { type: Boolean, default: false },
      verify: { type: Boolean, default: false },
      FavouriteMovie: {type : Array},
      age: {type: String},
      city: { type: String },
      BuyPackage: {type: Boolean, default: false},
      ExpireDate: {type: String},
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);