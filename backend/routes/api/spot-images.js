const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { SpotImage, Spot } = require("../../db/models");

router.delete("/:imageId", requireAuth, async (req, res) => {
  let { imageId } = req.params;

  let spotImage = await SpotImage.findByPk(imageId, { include: Spot });

  if (!spotImage) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  }

  if (!spotImage.Spot || spotImage.Spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await spotImage.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
