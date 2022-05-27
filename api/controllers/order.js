const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const findAllOrders = (req, res, next) => {
    // find using prommise
    Order
    .find()
    .select("productId quantity")
    .populate("productId", "name price")
    .populate("userId", "email")
    .exec()//to create a promise
    .then(orders => {
        if(orders.length > 0){
            res.status(200).json({message: 'Order found', count:orders.length, orders:orders});
        }
        else
            res.status(404).json({message:"No order found"});
    })
    .catch(err => {
        res.status(500).json({message:"Error", ...err});
    });


    // find using call back function
    // Order.find({}, "productId quantity", (err, orders) => {
    //     if(err) res.status(500).json({message:"Error", ...err});
    //     else{
    //         if(orders.length > 0){
    //             res.status(200).json({message: 'Order found', count:orders.length, orders:orders});
    //         }
    //         else
    //             res.status(404).json({message:"No order found"});
    //     }
    // })
};

const findAOrder = (req, res, next) => {

    // using promise
    const id = req.params.id;
    Order.findById(id)
    .select("productId quantity")
    .populate('productId', "name price")
    .populate("userId", "email")
    .exec()
    .then(order => {
        if(order){
            res.status(200).json({message: 'Order found', orders:order});
        }
        else
            res.status(404).json({message:"No order found"});
    })
    .catch(err => {
        res.status(500).json({message:"Error", ...err});
    })

    // using callback function
    // Order.findOne({_id:id}, "productId quantity", (err, order) => {
    //     if(err) res.status(500).json({message:"Error", ...err});
    //     else{
    //         if(order){
    //             res.status(200).json({message: 'Order found', orders:order});
    //         }
    //         else
    //             res.status(404).json({message:"No order found"});
    //     }
    // })
};

const createOrder = (req, res, next) => {
    const userId = req.userData.userId;
    const  order = new Order({
        _id: mongoose.Types.ObjectId(),
        productId: req.body.productId,
        userId: userId,
        quantity: req.body.quantity
    });
    Product.findById(req.body.productId,(err, product) => {
        if(err) res.status(500).json({message:"Error", ...err})
        else{
            if(product){
                order.save((err, order) => {
                    if(err) res.status(500).json({message:"Error", ...err});
                    else if(order) res.status(201).json({message:"Order created", order:order})
                })
            }
            else{
                res.status(404).json({message:"Product for the order is not available"})
            }
        }
    })
};

const deleteOrder = (req, res, next) => {
    const id = req.params.id;
    Order.remove({_id:id}, (err, order) => {
        if(err) {res.status(500).json({message:"Error", ...err})}
        else{
            if(order){res.status(200).json({message:'deletion successful', order:order})}
            else{res.status(404).json({message: 'order not found'})}
        }
    });
};

module.exports = {findAllOrders, findAOrder, createOrder, deleteOrder};