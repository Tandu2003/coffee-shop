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
      const product = await Product.findById(id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [POST] /api/products
  async postProduct(req, res) {
    try {
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

      const productImagesURL = await Promise.all(productImages?.map((e) => cloudinaryUploader(e)));
      const productImgs = [];
      for (const res of productImagesURL) productImgs.push(res.public_id);

      const makingImg = await Promise.all(making?.map((e) => cloudinaryUploader(e.img)));

      for (let i = 0; i < making.length; i++) {
        making[i].img = makingImg[i].public_id;
      }

      const images = await Promise.all([
        cloudinaryUploader(imgExtra.imgBag),
        cloudinaryUploader(imgExtra.imgSub),
        cloudinaryUploader(imageDisplay),
        cloudinaryUploader(imgBackground),
        cloudinaryUploader(imageMiddleRoast),
      ]);

      const data = await Product.create({
        name: productName,
        price: productPrice,
        productImages: productImgs,
        imageDisplay: images[2].public_id,
        imageBackground: images[3].public_id,
        bagSize,
        grind,
        newBadge,
        making,
        color,
        imageExtra: {
          imgBag: images[0].public_id,
          imgSub: images[1].public_id,
        },
        discription,
        description: productDesc,
        imageMiddleRoast: images[4].public_id,
      });

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ err: err });
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
    try {
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
      const _id = req.params.productId;

      const prevProduct = await Product.findOne({
        _id,
      });

      const deleteImage = async (e) => {
        cloudinary.uploader
          .destroy(e, function (error, result) {
            console.log(result, error);
          })
          .then((resp) => console.log(resp))
          .catch((_err) => console.log("Something went wrong, please try again later."));
      };
      if (imageDisplay.length > 30) deleteImage(prevProduct.imageDisplay);
      if (imgBackground.length > 30) deleteImage(prevProduct.imageBackground);
      if (imageMiddleRoast.length > 30) deleteImage(prevProduct.imageMiddleRoast);
      if (imgExtra.imgBag.length > 30) deleteImage(prevProduct.imageExtra.imgBag);
      if (imgExtra.imgSub.length > 30) deleteImage(prevProduct.imageExtra.imgSub);

      prevProduct.productImages?.map((e) => {
        if (!productImages.includes(e)) deleteImage(e);
      });

      prevProduct.making?.map((e) => {
        if (!making.find((el) => el.img === e.img)) deleteImage(e.img);
      });

      const cloudinaryUploader = (e) => {
        return cloudinary.uploader.upload(e, {
          upload_preset: "ok-but-first-coffee",
        });
      };
      const productImgs = [];

      const productImagesRes = await Promise.all(
        productImages?.map((e) => {
          if (e?.length > 30) {
            return cloudinaryUploader(e);
          } else {
            productImgs.push(e);
            return false;
          }
        })
      );
      for (const res of productImagesRes) res ? productImgs.push(res?.public_id) : "";
      const makingImg = await Promise.all(
        making?.map((e) => {
          if (e.img.length > 30) return cloudinaryUploader(e.img);
          return e;
        })
      );

      for (let i = 0; i < making.length; i++) {
        if (making[i].img.length > 30) making[i].img = makingImg[i].public_id;
      }

      const images = await Promise.all([
        imgExtra.imgBag.length > 30 ? cloudinaryUploader(imgExtra.imgBag) : imgExtra.imgBag,
        imgExtra.imgSub.length > 30 ? cloudinaryUploader(imgExtra.imgSub) : imgExtra.imgSub,
        imageDisplay.length > 30 ? cloudinaryUploader(imageDisplay) : imageDisplay,
        imgBackground.length > 30 ? cloudinaryUploader(imgBackground) : imgBackground,
        imageMiddleRoast.length > 30 ? cloudinaryUploader(imageMiddleRoast) : imageMiddleRoast,
      ]);

      for (let index = 0; index < images.length; index++) {
        images[index] = typeof images[index] === "string" ? images[index] : images[index].public_id;
      }

      await Product.updateOne(
        { _id },
        {
          name: productName,
          price: productPrice,
          productImages: productImgs,
          imageDisplay: images[2],
          imageBackground: images[3],
          bagSize,
          grind,
          newBadge,
          making,
          color,
          imageExtra: {
            imgBag: images[0],
            imgSub: images[1],
          },
          discription,
          description: productDesc,
          imageMiddleRoast: images[4],
        }
      );
      const product = await Product.findOne({ _id });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new ProductController();
