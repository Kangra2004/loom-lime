import express from "express";
import Category from "../models/Category.js";

const router = express.Router();


// GET ALL CATEGORIES

router.get("/", async (req,res) => {

  try{

    const categories = await Category.find();

    res.json(categories);

  }catch(err){

    res.status(500).json({message:err.message})

  }

});


// CREATE CATEGORY

router.post("/", async (req,res) => {

  try{

    const category = new Category(req.body);

    await category.save();

    res.status(201).json(category);

  }catch(err){

    res.status(400).json({message:err.message})

  }

});

export default router;