const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const {
  Spot,
  Review,
  User,
  ReviewImage,
  SpotImage,
} = require("../../db/models");

const formatDate = (date) => {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate();
  const hours = formattedDate.getHours();
  const minutes = ('0'+formattedDate.getMinutes()).slice(-2);
  const sec = ('0'+formattedDate.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${sec}`;
};

router.get("/current", requireAuth, async (req, res) => {
  let userId = req.user.id;

  let reviews = await Review.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
        include: {
          model: SpotImage,
          as: "previewImage",
          where: { preview: true },
          attributes: ["url"],
          limit: 1,
        },
      },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });

  reviews = reviews.map((review) => ({
    ...review.toJSON(),
    Spot: {
      ...review.Spot.toJSON(),
      previewImage: review.Spot.previewImage[0].url,
    },
  }));

  res.status(200).json({ Reviews: reviews });
});

router.post("/:reviewId/images", requireAuth, async (req, res) => {
  let { reviewId } = req.params;

  let { url } = req.body;

  let review = await Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  let imageCount = await ReviewImage.count({ where: { reviewId } });

  if (imageCount >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  let newImage = await ReviewImage.create({ reviewId, url });

  res.status(200).json({
    id: newImage.id,
    url: newImage.url,
  });
});

router.put("/:reviewId", requireAuth, async (req, res) => {
  let { reviewId } = req.params;
  let { review, stars } = req.body;

  let exists = await Review.findByPk(reviewId);

  if (!exists) {
    return res.status(404).json({
      message: " Review couldn't be found",
    });
  }

  if (exists.userId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  if (!review || !stars || isNaN(stars) || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      },
    });
  }

  exists.review = review;
  exists.stars = stars;
  await exists.save();

  res.status(200).json({
    id: exists.id,
    userId: exists.userId,
    spotId: exists.spotId,
    review: exists.review,
    stars: exists.stars,
    createdAt: formatDate(exists.createdAt),
    updatedAt: formatDate(exists.updatedAt),
  });
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
  let { reviewId } = req.params;
  let review = await Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await review.destroy();

  res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
