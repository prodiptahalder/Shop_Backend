const mongoose = require('mongoose');

const Product = require('../models/product');

const findAllProducts = (req, res, next) => {
    Product.find({}, 'name price _id productImage', (err, products) => {
        if(err) res.status(500).json({message:"Error", ...err});
        else{
            if(products.length > 0)
                res.status(200).json({message: 'Product found', count:products.length, products:products});
            else
                res.status(404).json({message:"No Product found"});
        }
    });
};

const findAProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findOne({_id:id}, 'name price _id productImage', (err, product) => {
        if(err) res.status(500).json({message:"Error", ...err});
        else{
            if(product)
                res.status(200).json({message:"Product found", product:product});
            else
                res.status(404).json({message:"Product not found"});
        }
    });
};

const createProduct = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save((err, product) => {
        if(err) res.status(500).json({message:"Error", ...err});
        else{
            res.status(201).json({
                product: product,
                message: 'Product created'
            });
        }
    });
};

const updateProduct = (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const updateOps = {};
    for(const ops in data) updateOps[ops] = data[ops];
    Product.updateOne({_id: id}, {$set: updateOps}, (err, product) => {
        if(err) {res.status(500).json({message:"Error", ...err})}
        else{
            if(product)
                res.status(200).json({message:"Product updated", ...product});
            else
                res.status(404).json({message:"Product not found"});
        }
    })
};

const deleteProduct = (req, res, next) => {
    const id = req.params.id;
    Product.remove({_id:id}, (err, product) => {
        if(err) {res.status(500).json({message:"Error", ...err})}
        else{
            if(product){res.status(200).json({message:'deletion successful', ...product})}
            else{res.status(404).json({message: 'Product not found'})}
        }
    });
}

module.exports = {findAllProducts, findAProduct, createProduct, updateProduct, deleteProduct}