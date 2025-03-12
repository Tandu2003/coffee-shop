const Merch = require("../models/merch.model");
const cloudinary = require("../config/cloudinary");

class MerchController {
  // [GET] /api/merch
  async getMerches(req, res) {
    try {
      const merch = await Merch.find();
      res.status(200).json(merch);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [GET] /api/merch/:id
  async getMerch(req, res) {
    const { id } = req.params;
    try {
      const merch = await Merch.findById({ _id: id });
      res.status(200).json(merch);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [POST] /api/merch
  async postMerch(req, res) {
    const {
      name,
      price,
      imageDisplay,
      merchImages,
      size,
      brand,
      availability,
      newBadge,
      color,
      description,
      features,
      review,
      question,
    } = req.body;

    const cloudinaryUploader = (e) => {
      return cloudinary.uploader.upload(e, {
        upload_preset: "ok-but-first-coffee",
      });
    };

    try {
      const merchImagesCloudinary = await Promise.all(merchImages?.map(cloudinaryUploader));
      const images = await Promise.all([cloudinaryUploader(imageDisplay)]);

      const newMerch = new Merch({
        name,
        price,
        imageDisplay: images[0].url,
        merchImages: merchImagesCloudinary.map((e) => e.url),
        size,
        brand,
        availability,
        newBadge,
        color,
        description,
        features,
        review,
        question,
      });

      await newMerch.save();
      res.status(200).json(newMerch);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // /:username

  // const { username } = req.params;

  // [DELETE] /api/merch/:id
  async deleteMerch(req, res) {
    const { id } = req.params;
    try {
      await Merch.findByIdAndDelete({ _id: id });
      res.status(200).json({ message: "Merch deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [PUT] /api/merch/:id
  async putMerch(req, res) {
    const { id } = req.params;

    const exitMerch = await Merch.findById({ _id: id });

    if (!exitMerch) {
      return res.status(404).json({ message: "Merch not found" });
    }

    const {
      name,
      price,
      imageDisplay,
      merchImages,
      size,
      brand,
      availability,
      newBadge,
      color,
      description,
      features,
      review,
      question,
    } = req.body;

    const cloudinaryUploader = (e) => {
      return cloudinary.uploader.upload(e, {
        upload_preset: "ok-but-first-coffee",
      });
    };

    try {
      const merchImagesCloudinary = await Promise.all(merchImages?.map(cloudinaryUploader));
      const images = await Promise.all([cloudinaryUploader(imageDisplay)]);

      const updatedMerch = {
        name,
        price,
        imageDisplay: images[0].url,
        merchImages: merchImagesCloudinary.map((e) => e.url),
        size,
        brand,
        availability,
        newBadge,
        color,
        description,
        features,
        review,
        question,
      };

      await Merch.findByIdAndUpdate({ _id: id }, updatedMerch);
      res.status(200).json(updatedMerch);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MerchController();
