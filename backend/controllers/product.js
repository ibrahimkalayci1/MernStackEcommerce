import Product from "../models/product.js";
import ProductFilter from "../utils/productFilter.js";
import { v2 as cloudinary } from "cloudinary";

export const allProducts = async (req, res, next) => {
    try {
      const resultPerPage = 10;
  
      const productFilter = new ProductFilter(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
  
      const products = await productFilter.query;
  
      res.status(200).json({ products });
  
    } catch (error) {
      next(error);
    }
  };
  

export const adminProducts = async (req,res,next) => {
    const products =await Product.find();
    res.status(200).json({
        products
    })
}


export const detailProducts = async (req,res) => {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
        product
    })
}
    //! admin
    export const createProduct = async (req, res, next) => {
        try {
          let images = [];
      
          if (typeof req.body.images === "string") {
            images.push(req.body.images);
          } else {
            images = req.body.images;
          }
      
          let allImage = [];
      
          for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
              folder: "products",
            });
      
            allImage.push({
              public_id: result.public_id,
              url: result.secure_url,
            });
          }
      
          req.body.images = allImage;
          req.body.user = req.user.id;
      
          const product = await Product.create(req.body);
      
          res.status(201).json({ product });
      
        } catch (error) {
          next(error);
        }
      };
      

export const deleteProduct = async (req, res,next) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({
          message: "Ürün bulunamadı",
        });
      }
  
      // Cloudinary'den resimleri sil
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
      }
  
      // DB'den sil
      await Product.findByIdAndDelete(req.params.id);
  
      res.status(200).json({
        message: "Ürün başarıyla silindi",
      });
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  





export const updateProduct = async (req,res,next) => {
    const product = await Product.findById(req.params.id);

    let images = [];
    if(typeof req.body.images === "string" ){
        
            images.push(req.body.images)
        
    }
    else{
        images= req.body.images
    }

    if(images !==undefined) {
        for(let i = 0; i<product.images.length; i++) {
            await cloudinary.uploader.destroy(product.images[i].public_id)
        }
    }

let allImage = []
for (let i =0; i<images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i],  {
        folder:"products"
    })

    allImage.push({
        public_id:result.public_id,
        url:result.secure_url
    })
}

req.body.images = allImage


    product = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true})

    res.status(200).json({
        product
    })
}

export const createReview = async (req,res,next) => {
    const {product_id,comment,rating} = req.body

    const review = {
        user: req.user._id,
        name:req.user.name,
        comment,
        rating:Number(rating)
    }
    const product = await Product.findById(product_id);
    product.reviews.push(review)



    let avg = 0;
    product.reviews.forEach(rev =>  {
        avg += rev.rating
    } )

    product.rating = avg /product.reviews.length

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        message: "Yorumun Başarıyla Eklendi..."
    })

} 


