const express = require("express");
const { Op, sequelize } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, SpotImage, User } = require("../../db/models");




router.get("/current", requireAuth, async (req, res) => {

  const userId = req.user.id;

  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
  });
    for (let spot of spots) {
      let sum = 0;
      const reviews = await Review.findAll({
        where: { spotId: spot.id },
      });
      for (let review of reviews) {
        sum += review.stars;
      }
      let average;
      if (reviews.length > 0) {
        average = sum / reviews.length;
      } else {
        average = 0;
      }
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
      }
    }

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

router.get("/:spotId", async (req, res) => {
  let { spotId } = req.params;

  let spot = await Spot.findOne({
    where: {
      id: spotId,
    },
  });

    let sum = 0;

  const reviews = await Review.findAll({
    where: { spotId: spot.id },
  });

  for (let review of reviews) {
    sum += review.stars;
  }

  let average;
  let numReviews = reviews.length;
  spot.numReviews = numReviews;
  if (numReviews > 0) {
    average = sum / numReviews;
  }


  else {
    average = 0;
  }

  spot.avgRating = average;

    let images = await SpotImage.findAll({
      where: { spotId: spot.id },
      attributes: ["id", "url", "preview"]
      });
  spot.images = images;


  let owner = await User.findOne({
    where: { id: spot.ownerId },
    attributes: ["id","firstName", "lastName"]
  })

  spot.owner = owner;

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }


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

  }
  // console.log(spot)
  return res.status(200).json(returnSpot);
});

router.get("/", async (req, res) => {

  const spots = await Spot.findAll({});
  for (let spot of spots) {
    let sum = 0;
    const reviews = await Review.findAll({
      where: { spotId: spot.id },
    });
    for (let review of reviews) {
      sum += review.stars;
    }
    let average;
    if (reviews.length > 0) {
      average = sum / reviews.length;
    } else {
      average = 0;
    }
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
    }
  }


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


module.exports = router;
