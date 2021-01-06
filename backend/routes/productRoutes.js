import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import {protect, admin} from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/" , asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = req.query.pageNumber || 1;
    const keyword = req.query.keyword ? {
        name:{
            $regex:req.query.keyword,
            $options: "i"
        }
    }:{}
    const count = await Product.countDocuments({...keyword});
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));
    res.json({products, page, pages:Math.ceil(count / pageSize)})
}))

router.get("/top", asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({rating:-1}).limit(3);
    res.json(products);
}))

router.get("/:id" , asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product){
        res.json(product);
    }else {
        res.status(404)
        throw new Error("Product not found")
    }
}))

router.delete("/:id", protect, admin, asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    if(product){
        await product.remove();
        res.json({message : "Product is removed"})
    } else {
        res.status(404);
        throw new Error("Product is not found")
    }
}))

router.post("/", protect, admin, asyncHandler(async(req, res) => {
    const product = new Product({
        name:"sample name",
        price:0,
        user:req.user._id,
        image:"/images/sample.jpg",
        brand:"sample brand",
        category:"sample category",
        countInStock:0,
        numReviews:0,
        description:"sample description"
    })
    const createdProduct = await product.save();
    res.status(201).json(createdProduct)
}))

router.put("/:id", protect, admin, asyncHandler(async(req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body
    const product = await Product.findById(req.params.id);
    if(product){
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Product is not found");
    }
}))

router.post("/:id/reviews", protect, asyncHandler(async (req, res) => {
    const {rating, comment} = req.body;
    const product = await Product.findById(req.params.id);
    if(product){
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString())
        if(alreadyReviewed){
            res.status(400);
            throw new Error("Product is already reviewed")
        }
        const review = {
            name:req.user.name,
            rating:Number(rating),
            comment,
            user:req.user._id
        }
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length
        await product.save()
        res.status(201).json({message:"Review is added"})
    } else {
        res.status(404)
        throw new Error("Product is not found");
    }
}))



export default router;