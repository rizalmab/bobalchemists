const express = require("express");
const base_seed = require("../models/Ingredients/base_seed");
const Router = express.Router();

//import tea cards info
const TeaCardsInfo = require("../models/teaCardInfo");
const teaCardInfo_seed = require("../models/teaCardInfo_seed");

//ROUTES ('api/teacardsinfo/')
//get "api/teacardsinfo/seed"
Router.get("/seed", async (req, res) => {
  try {
    await TeaCardsInfo.deleteMany({});
    const seedCards = await TeaCardsInfo.create(teaCardInfo_seed);
    res.status(200).json({
      status: "ok",
      message: "tea cards seeded",
      data: seedCards,
    });
  } catch (error) {
    console.log("at teacardsinfo/seed", error);
  }
});

//get "api/teacardsinfo"
Router.get("/", async (req, res) => {
  try {
    const populatedCards = await TeaCardsInfo.find({})
      .populate("createdBy", "username")
      .populate("base", ["name", "img"])
      .populate("flavour", ["name", "img"])
      .populate("toppings", ["name", "img"]);
    res.status(200).json({
      status: "ok",
      message: "populated teaCards returned",
      data: populatedCards,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = Router;
