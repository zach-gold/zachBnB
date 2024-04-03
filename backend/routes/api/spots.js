const express = require("express");
const { Op, sequelize } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, SpotImage, User } = require("../../db/models");


//rewrite later to use express validators
const spotValidator = (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  if (!address || !city || !state || !country || !lat || lat < -90 || lat > 90 || !lng || lng <- 180 || lng > 180 || !name || name.length > 50 || !description || !price || price < 0)  {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        address: "Street address is required",
        city: "City is required",
        state: "State is required",
        country: "Country is required",
        lat: "Latitude must be within -90 and 90",
        lng: "Longitude must be within -180 and 180",
        name: "Name must be less than 50 characters",
        description: "Description is required",
        price: "Price per day must be a positive number",
      },
    });
  }
  next();
};



//get all spots owned by currently logged in user
router.get("/current", requireAuth, async (req, res) => {

  const userId = req.user.id;

  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
  });
  //refactor later into helper func, keep it DRY (maybe new file in utils?)
    //iterate thu spots arr
  for (let spot of spots) {

    //get avgReview
      let sum = 0;
      const reviews = await Review.findAll({
        where: { spotId: spot.id },
      });
      for (let review of reviews) {
        sum += review.stars;
    };
      let average;
      if (reviews.length > 0) {
        average = sum / reviews.length;
      } else {
        average = 0;
    };
    spot.avgRating = average;

    //get image
      let previewImage = await SpotImage.findOne({
        where: { spotId: spot.id, preview: true },
        attributes: ["url"],
      });
      //in case of no image, url cant just be null
      if (previewImage) {
        spot.previewImage = previewImage;
      }
      else {
        let failsafe = {
          url: "No Image"
        }
        spot.previewImage = failsafe;
    };
  };
    //build array of spots with avg rating and preview image
    const allSpots = spots.map((spot) => {
      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.avgRating || 0,
        previewImage: spot.previewImage.url,
      };
    });

  res.status(200).json({ Spots: allSpots });
});

//get a spot by spotId
router.get("/:spotId", async (req, res) => {
  let { spotId } = req.params;

  let spot = await Spot.findOne({
    where: {
      id: spotId,
    },
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  };
  //get avgReview
    let sum = 0;

  const reviews = await Review.findAll({
    where: { spotId: spot.id },
  });

  for (let review of reviews) {
    sum += review.stars;
  };

  let average;
  let numReviews = reviews.length;
  spot.numReviews = numReviews;
  if (numReviews > 0) {
    average = sum / numReviews;
  }
  else {
    average = 0;
  };

  spot.avgRating = average;

//get images
    let images = await SpotImage.findAll({
      where: { spotId: spot.id },
      attributes: ["id", "url", "preview"]
      });
  spot.images = images;

//get owner
  let owner = await User.findOne({
    where: { id: spot.ownerId },
    attributes: ["id", "firstName", "lastName"]
  });

  spot.owner = owner;

  //build return spot with numreviews, avg rating spotimages and owner
  const returnSpot = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    numReviews: spot.numReviews,
    avgStarRating: spot.avgRating || 0,
    SpotImages: spot.images,
    Owner: spot.owner,

  };
  return res.status(200).json(returnSpot);
});

//get all spots
router.get("/", async (req, res) => {


  const spots = await Spot.findAll({});

  //refactor later for DRYness
  for (let spot of spots) {
    let sum = 0;
    const reviews = await Review.findAll({
      where: { spotId: spot.id },
    });
    for (let review of reviews) {
      sum += review.stars;
    };
    let average;
    if (reviews.length > 0) {
      average = sum / reviews.length;
    } else {
      average = 0;
    };
    spot.avgRating = average;
    let previewImage = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true },
      attributes: ["url"],
    });

    if (previewImage) {
      spot.previewImage = previewImage;
    }
    else {
      let failsafe = {
        url: "No Image"
      }
      spot.previewImage = failsafe;
    };
  };


  const allSpots = spots.map((spot) => {
    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: spot.avgRating || 0,
      previewImage: spot.previewImage.url,
    };
  });
  res.status(200).json({ Spots: allSpots });
});



router.post("/", requireAuth, spotValidator, async (req, res) => {
  let { address, city, state, country, lat, lng, name, description, price } = req.body
  const newSpot = await Spot.create({ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price});

  res.status(201).json(newSpot);
});

router.put("/:spotId", requireAuth, spotValidator, async (req, res) => {
  let { spotId } = req.params;
  let { address, city, state, country, lat, lng, name, description, price } = req.body;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  };

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden"
    })
  };

  await spot.update({ address, city, state, country, lat, lng, name, description, price });

  let resSpot = {
  id: spot.id,
  ownerId: spot.ownerId,
  address: spot.address,
  city: spot.city,
  state: spot.state,
  country: spot.country,
  lat: spot.lat,
  lng: spot.lng,
  name: spot.name,
  description: spot.description,
  price: spot.price,
  createdAt: spot.createdAt,
  updatedAt: spot.updatedAt,
};
  return res.status(200).json(resSpot)
});


router.post("/:spotId/images", requireAuth, async (req, res) => {
  let { spotId } = req.params;
  let { url, preview } = req.body;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  };

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden"
    });
  };

  let image = await SpotImage.create({
    spotId,
    url,
    preview,
  });

  res.status(200).json({
    id: image.id,
    url: image.url,
    preview: image.preview,
  });
});

router.delete("/:spotId", requireAuth, async (req, res) => {
  let { spotId } = req.params;
  let spot = await Spot.findByPk(spotId)

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  };

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden"
    })
  };

  await spot.destroy();

  return res.status(200).json({
    message: "Successfully deleted"
  });
});



module.exports = router;
