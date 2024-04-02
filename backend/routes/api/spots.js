const express = require("express");
const { Op, sequelize } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, SpotImage } = require("../../db/models");

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
  if (reviews.length > 0) {
    average = sum / reviews.length;
  }

  else {
    average = 0;
  }

    spot.avgRating = average;

    let images = await SpotImage.findAll({
        where: { spotId: spot.id},
        attributes: ["url"],
      });
      spot.images = images;

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  return res.status(200).json(spot);
});


router.get("/current", requireAuth, async (req, res) => {

  const userId = req.user.id;

  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
  });

  res.status(200).json({ Spots: spots });
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
    spot.previewImage = previewImage;
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
