const express = require("express");
const { Op, sequelize } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const {
  Spot,
  Review,
  SpotImage,
  User,
  Booking,
  ReviewImage,
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


const formatStartEndDate = (date) => {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate() + 1;

  return `${year}-${month}-${day}`;
};

//rewrite later to use express validators
const spotValidator = (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  if (
    !address ||
    !city ||
    !state ||
    !country ||
    !lat ||
    lat < -90 ||
    lat > 90 ||
    !lng ||
    lng < -180 ||
    lng > 180 ||
    !name ||
    name.length > 50 ||
    !description ||
    !price ||
    price < 0
  ) {
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
    }
    let average;
    if (reviews.length > 0) {
      average = sum / reviews.length;
    } else {
      average = 0;
    }
    spot.avgRating = average;

    //get image
    let previewImage = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true },
      attributes: ["url"],
    });
    //in case of no image, url cant just be null
    if (previewImage) {
      spot.previewImage = previewImage;
    } else {
      let failsafe = {
        url: "No Image",
      };
      spot.previewImage = failsafe;
    }
  }
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
      createdAt: formatDate(spot.createdAt),
      updatedAt: formatDate(spot.updatedAt),
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
  }
  //get avgReview
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
  } else {
    average = 0;
  }

  spot.avgRating = average;

  //get images
  let images = await SpotImage.findAll({
    where: { spotId: spot.id },
    attributes: ["id", "url", "preview"],
  });
  spot.images = images;

  //get owner
  let owner = await User.findOne({
    where: { id: spot.ownerId },
    attributes: ["id", "firstName", "lastName"],
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
    createdAt: formatDate(spot.createdAt),
    updatedAt: formatDate(spot.updatedAt),
    numReviews: spot.numReviews,
    avgStarRating: spot.avgRating || 0,
    SpotImages: spot.images,
    Owner: spot.owner,
  };
  return res.status(200).json(returnSpot);
});

//get all spots
router.get("/", async (req, res) => {
  let { page, size } = req.query;

  page = parseInt(page) || 1;
  size = parseInt(size) || 20;

  if (page > 10) page = 10;
  if (size > 20) size = 20;

  let pagination = {
    limit: size,
    offset: size * (page - 1),
  };
  const spots = await Spot.findAll({...pagination});

  //refactor later for DRYness
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
    } else {
      let failsafe = {
        url: "No Image",
      };
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
      createdAt: formatDate(spot.createdAt),
      updatedAt: formatDate(spot.updatedAt),
      avgRating: spot.avgRating || 0,
      previewImage: spot.previewImage.url,
    };
  });

  let paginatedResponse = { Spots: allSpots };
  paginatedResponse.page = page;
  paginatedResponse.size = size;
  res.status(200).json(paginatedResponse);
});

router.post("/", requireAuth, spotValidator, async (req, res) => {
  let { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

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
    createdAt: formatDate(spot.createdAt),
    updatedAt: formatDate(spot.updatedAt),
  };
  return res.status(200).json(resSpot);
});

router.put("/:spotId", requireAuth, spotValidator, async (req, res) => {
  let { spotId } = req.params;
  let { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await spot.update({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

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
    createdAt: formatDate(spot.createdAt),
    updatedAt: formatDate(spot.updatedAt),
  };
  return res.status(200).json(resSpot);
});

router.post("/:spotId/images", requireAuth, async (req, res) => {
  let { spotId } = req.params;
  let { url, preview } = req.body;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

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
  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await spot.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  let { spotId } = req.params;
  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId === req.user.id) {
    let bookings = await Booking.findAll({
      where: { spotId },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });
    let response = {
      Bookings: bookings.map((booking) => ({
        User: {
          id: booking.User.id,
          firstName: booking.User.firstName,
          lastName: booking.User.lastName,
        },
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: formatStartEndDate(booking.startDate),
        endDate: formatStartEndDate(booking.endDate),
        createdAt: formatDate(booking.createdAt),
      updatedAt: formatDate(booking.updatedAt),
      })),
    };
    res.status(200).json(response);
  } else {
    let bookings = await Booking.findAll({
      where: {
        spotId,
      },
      attributes: ["spotId", "startDate", "endDate"],
    });

    let response = {
      Bookings: bookings.map((booking) => ({
        spotId: booking.spotId,
        startDate: formatStartEndDate(booking.startDate),
        endDate: formatStartEndDate(booking.endDate),
      })),
    };
    res.status(200).json(response);
  }
});

router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  let { spotId } = req.params;
  let { review, stars } = req.body;
  let userId = req.user.id;

  if (!review || isNaN(stars) || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      },
    });
  }

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  let exists = await Review.findOne({
    where: { spotId, userId },
  });

  if (exists) {
    return res.status(500).json({
      message: "User already has a review for this spot",
    });
  }

  let newReview = await Review.create({ spotId, userId, review, stars });

  res.status(201).json({
    id: newReview.id,
    userId: newReview.userId,
    spotId: +newReview.spotId,
    review: newReview.review,
    stars: newReview.stars,
    createdAt: formatDate(newReview.createdAt),
      updatedAt: formatDate(newReview.updatedAt),
  });
});

router.get("/:spotId/reviews", async (req, res) => {
  let { spotId } = req.params;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  let reviews = await Review.findAll({
    where: { spotId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  let resReview = reviews.map((review) => ({
    id: review.id,
    userId: review.userId,
    spotId: review.spotId,
    review: review.review,
    stars: review.stars,
    createdAt: formatDate(review.createdAt),
      updatedAt: formatDate(review.updatedAt),
    User: {
      id: review.User.id,
      firstName: review.User.firstName,
      lastName: review.User.lastName,
    },
    ReviewImages: review.ReviewImages,
  }));

  res.status(200).json({ Reviews: resReview });
});

router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  let { spotId } = req.params;
  let { startDate, endDate } = req.body;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId === req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  if (
    new Date(startDate) < new Date() ||
    new Date(endDate) <= new Date(startDate) ||
    !startDate ||
    !endDate
  ) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past",
        endDate: "endDate cannot be on or before startDate",
      },
    });
  }

  let exists = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        {
          [Op.and]: [
            { startDate: { [Op.lte]: startDate } },
            { endDate: { [Op.gte]: endDate } },
          ],
        },
        {
          [Op.and]: [
            { startDate: { [Op.gte]: startDate } },
            { endDate: { [Op.lte]: endDate } },
          ],
        },
        {
          [Op.and]: [
            { startDate: { [Op.lt]: endDate } },
            { endDate: { [Op.gt]: startDate } },
          ],
        },
        {
          [Op.or]: [
            { startDate: { [Op.between]: [startDate, endDate] } },
            { endDate: { [Op.between]: [startDate, endDate] } },
          ],
        },
      ],
    },
  });

  if (exists) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }
  if (spot.ownerId !== req.user.id) {
    let newBooking = await Booking.create({
      spotId,
      userId: req.user.id,
      startDate,
      endDate,
    });

    let response = {
      id: newBooking.id,
      spotId: +newBooking.spotId,
      userId: newBooking.userId,
      startDate: formatStartEndDate(newBooking.startDate),
        endDate: formatStartEndDate(newBooking.endDate),
        createdAt: formatDate(newBooking.createdAt),
      updatedAt: formatDate(newBooking.updatedAt),
    };

    res.status(200).json(response);
  }
});

module.exports = router;
