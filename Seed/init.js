require("dotenv").config();
const initData = require("../Seed/data.js");
const mongoose = require("mongoose");
const Explore = require("../models/explore.js");

const DB_URL = process.env.ATLAS_DB_URL;
main()
  .then(() => {
    console.log("connection successfully");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(DB_URL);
}

const initDB = async () => {
  await Explore.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6921154db37a88a25cade1ca",
  }));
  await Explore.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
