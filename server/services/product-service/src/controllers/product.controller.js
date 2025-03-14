const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary");

class ProductController {
  // [GET] /api/products
  async getProducts(req, res) {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [GET] /api/products/:id
  async getProduct(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findById({ _id: id });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [POST] /api/products
  async postProduct(req, res) {
    const {
      productName,
      productPrice,
      productDesc,
      discription,
      imageDisplay,
      imgBackground,
      productImages,
      newBadge,
      bagSize,
      grind,
      making,
      imgExtra,
      color,
      imageMiddleRoast,
    } = req.body;

    const cloudinaryUploader = (e) => {
      return cloudinary.uploader.upload(e, {
        upload_preset: "ok-but-first-coffee",
      });
    };

    try {
      const productImagesCloudinary = await Promise.all(productImages?.map(cloudinaryUploader));
      const makingCloudinary = await Promise.all(making?.map(cloudinaryUploader));
      const images = await Promise.all([
        cloudinaryUploader(imageDisplay),
        cloudinaryUploader(imgBackground),
        cloudinaryUploader(imgExtra.imgBag),
        cloudinaryUploader(imgExtra.imgSub),
        cloudinaryUploader(imageMiddleRoast),
      ]);

      const newProduct = new Product({
        productName,
        productPrice,
        productDesc,
        discription,
        imageDisplay: images[0].public_id,
        imgBackground: images[1].public_id,
        productImages: productImagesCloudinary.map((img) => img.public_id),
        newBadge,
        bagSize,
        grind,
        making: makingCloudinary.map((img) => img.public_id),
        imgExtra: {
          imgBag: images[2].public_id,
          imgSub: images[3].public_id,
        },
        color,
        imageMiddleRoast: images[4].public_id,
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [DELETE] /api/products/:id
  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      await Product.findByIdAndDelete({ _id: id });
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [PUT] /api/products/:id
  async putProduct(req, res) {
    const { id } = req.params;

    const exitProduct = await Product.findById({ _id: id });

    if (!exitProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      productName,
      productPrice,
      productDesc,
      discription,
      imageDisplay,
      imgBackground,
      productImages,
      newBadge,
      bagSize,
      grind,
      making,
      imgExtra,
      color,
      imageMiddleRoast,
    } = req.body;

    const cloudinaryUploader = (e) => {
      return cloudinary.uploader.upload(e, {
        upload_preset: "ok-but-first-coffee",
      });
    };

    try {
      const productImagesCloudinary = await Promise.all(productImages?.map(cloudinaryUploader));
      const makingCloudinary = await Promise.all(making?.map(cloudinaryUploader));
      const images = await Promise.all([
        cloudinaryUploader(imageDisplay),
        cloudinaryUploader(imgBackground),
        cloudinaryUploader(imgExtra.imgBag),
        cloudinaryUploader(imgExtra.imgSub),
        cloudinaryUploader(imageMiddleRoast),
      ]);

      const updatedProduct = {
        productName,
        productPrice,
        productDesc,
        discription,
        imageDisplay: images[0].public_id,
        imgBackground: images[1].public_id,
        productImages: productImagesCloudinary.map((img) => img.public_id),
        newBadge,
        bagSize,
        grind,
        making: makingCloudinary.map((img) => img.public_id),
        imgExtra: {
          imgBag: images[2].public_id,
          imgSub: images[3].public_id,
        },
        color,
        imageMiddleRoast: images[4].public_id,
      };

      await Product.findByIdAndUpdate({ _id: id }, updatedProduct, {
        new: true,
      });
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
