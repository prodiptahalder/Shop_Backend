const express = require('express');
const router = express.Router();
const multer = require('multer');
const {adminAuth} = require('../middleware_auth/checkAuth');
const {findAllProducts, findAProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/');
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = function(req, file, cb){

    // cb(null, false); //to not store file
    // cb(null, true); //to store file
    // cb(false); //to not store and throw error

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(false);
    }
}

const upload = multer({
    storage: storage, 
    limits:{
        fileSize: 1024*1024*100//100MB
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

//get all products
router.get('/', findAllProducts);

//get a particular product
router.get('/:id', findAProduct);

//create a product
router.post('/', adminAuth, upload.single('productImage'), createProduct);

//update a product
router.patch('/:id', adminAuth, updateProduct);

//Delete a product
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;