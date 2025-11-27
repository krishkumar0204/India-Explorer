const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExplorePlace = new Schema({
  title: {
    type: String,
    required: true,
  },
  brief: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    folder: {
      type: String,
      required: true,
    },
    url1: {
      type: String,
      required: true,
    },
    url2: {
      type: String,
      required: true,
    },
    url3: {
      type: String,
      required: true,
    },
    url4: {
      type: String,
      required: true,
    },
    url5: {
      type: String,
      required: true,
    },
  },

  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  info: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  visitTime: {
    type: String,
    required: true,
  },
  famous: {
    type: String,
    required: true,
  },
  place1: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  place2: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  place3: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
});

ExplorePlace.post("findOneAndDelete", async (doc) => {
  if (doc) {
    const Review = require("../models/review.js");
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Explore = mongoose.model("Explore", ExplorePlace);

module.exports = Explore;
