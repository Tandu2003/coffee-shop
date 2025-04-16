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
    try {
      const {
        merchName,
        merchPrice,
        newBadge,
        size,
        availability,
        color,
        brand,
        imageDisplay,
        merchImages,
        merchDesc,
        features,
      } = req.body;

      const cloudinaryUploader = (e) => {
        return cloudinary.uploader.upload(e, {
          upload_preset: "ok-but-first-coffee",
        });
      };

      const merchImagesURL = await Promise.all(
        merchImages?.map((e) => cloudinaryUploader(e))
      );
      const merchImgs = [];
      for (const res of merchImagesURL) merchImgs.push(res.public_id);
      const imgDisplayCloudinary = await cloudinaryUploader(imageDisplay);

      const data = new Merch({
        name: merchName,
        price: merchPrice,
        imageDisplay: imgDisplayCloudinary.public_id,
        merchImages: merchImgs,
        newBadge,
        size,
        availability,
        color,
        brand,
        description: merchDesc,
        features,
      });

      await data.save();

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
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
    try {
      const {
        merchName,
        merchPrice,
        newBadge,
        size,
        availability,
        color,
        brand,
        imageDisplay,
        merchImages,
        merchDesc,
        features,
      } = req.body;
      const _id = req.params.merchId;

      const prevProduct = await Merch.findOne({
        _id,
      });

      const deleteImage = async (e) => {
        cloudinary.uploader
          .destroy(e, function (error, result) {
            console.log(result, error);
          })
          .then((resp) => console.log(resp))
          .catch((_err) =>
            console.log("Something went wrong, please try again later.")
          );
      };
      if (imageDisplay.length > 30) deleteImage(prevProduct.imageDisplay);

      prevProduct.merchImages?.map((e) => {
        if (!merchImages.includes(e)) deleteImage(e);
      });

      const cloudinaryUploader = (e) => {
        return cloudinary.uploader.upload(e, {
          upload_preset: "ok-but-first-coffee",
        });
      };
      const merchImgs = [];

      const merchImagesRes = await Promise.all(
        merchImages?.map((e) => {
          if (e?.length > 30) {
            return cloudinaryUploader(e);
          } else {
            merchImgs.push(e);
            return false;
          }
        })
      );
      for (const res of merchImagesRes)
        res ? merchImgs.push(res?.public_id) : "";

      let imgDisplayCloudinary = await (imageDisplay.length > 30
        ? cloudinaryUploader(imageDisplay)
        : imageDisplay);
      if (typeof imgDisplayCloudinary !== "string")
        imgDisplayCloudinary = imgDisplayCloudinary.public_id;
      await Merch.updateOne(
        { _id },
        {
          name: merchName,
          price: merchPrice,
          imageDisplay: imgDisplayCloudinary,
          merchImages: merchImgs,
          newBadge,
          size,
          availability,
          color,
          brand,
          description: merchDesc,
          features,
        }
      );
      const product = await Merch.findOne({ _id });
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = new MerchController();
