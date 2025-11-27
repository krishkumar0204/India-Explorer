const ExplorePlaces = require("../models/explore.js");

// index route

module.exports.Index = async (req, res, next) => {
  const explores = await ExplorePlaces.find({});
  res.render("Explore/index.ejs", { explores });
};

// Show route

module.exports.showPlace = async (req, res, next) => {
  let { id } = req.params;
  let explore = await ExplorePlaces.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });
  if (!explore) {
    return next(new Error("Place not found"));
  }
  res.render("Explore/show.ejs", {
    explore,
    reviews: explore.reviews,
    currUser: req.user,
  });
};

// New route

module.exports.newForm = (req, res) => {
  res.render("Explore/new.ejs");
};

module.exports.newPlace = async (req, res, next) => {
  const newPlace = new ExplorePlaces(req.body.explore);
  newPlace.image = {
    folder: "Indian_Explorer_Dev",
    url1: req.files["explore[image][url1]"]?.[0]?.path,
    url2: req.files["explore[image][url2]"]?.[0]?.path,
    url3: req.files["explore[image][url3]"]?.[0]?.path,
    url4: req.files["explore[image][url4]"]?.[0]?.path,
    url5: req.files["explore[image][url5]"]?.[0]?.path,
  };
  newPlace.owner = req.user._id;
  await newPlace.save();
  req.flash("success", "New place added");
  res.redirect("/explore");
};

// edit  route

module.exports.editForm = async (req, res, next) => {
  let { id } = req.params;
  const explore = await ExplorePlaces.findById(id);
  if (!explore) {
    req.flash("error", "Place you looking for doesn't exists");
    res.redirect("/explore");
    return;
  }
  res.render("Explore/edit.ejs", { explore });
};

module.exports.editPlace = async (req, res, next) => {
  let { id } = req.params;
  const place = await ExplorePlaces.findById(id);

  Object.assign(place, req.body.explore);

  if (req.files) {
    if (req.files["explore[image][url1]"])
      place.image.url1 = req.files["explore[image][url1]"][0].path;

    if (req.files["explore[image][url2]"])
      place.image.url2 = req.files["explore[image][url2]"][0].path;

    if (req.files["explore[image][url3]"])
      place.image.url3 = req.files["explore[image][url3]"][0].path;

    if (req.files["explore[image][url4]"])
      place.image.url4 = req.files["explore[image][url4]"][0].path;

    if (req.files["explore[image][url5]"])
      place.image.url5 = req.files["explore[image][url5]"][0].path;
  }
  await place.save();

  req.flash("success", "Data edited successfully");
  res.redirect(`/explore/${id}`);
};

// Delete Route

module.exports.deletePlace = async (req, res, next) => {
  let { id } = req.params;
  await ExplorePlaces.findByIdAndDelete(id);
  req.flash("success", "place deleted successfully");
  res.redirect("/explore");
};
