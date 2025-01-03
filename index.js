const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const mongoose = require("mongoose");

const port = process.env.PORT || 1000;
const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: Number,
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}); //Document


const Product = mongoose.model('Products', productSchema) //Collection
mongoose.connect(process.env.CONNECTION_STRING);

app.get("/", (req, res) => {
  res.send("Server runnning");
});
// Create
app.post('/products',async(req,res) => {
    try{
        const newProduct = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
        });
        const result = await newProduct.save();
        res.status(201).send(result)
    }catch (error) {
        res.status(400).json({message:error.message})
    }
})

// Read
app.get('/products',async(req,res)=>{
    try {
        const id = req.params.id
        const result = await Product.find().sort({price:-1})
        res.status(200).send({
            success:true,
            data:result
        })
    } catch (error) {
        res.status(404).json({message:error.message})
    }
})

// Read Single
app.get('/product/:id',async(req,res)=>{
    try {
        const id = req.params.id
        const result = await Product.find({_id : id}).select({title:true,price:true,_id:0})
        res.status(200).send({
            success:true,
            data:result
        })
    } catch (error) {
        res.status(404).json({message:error.message})
    }
})

app.listen(port, () => {
  console.log(`Server running on: ${port}`);
});
