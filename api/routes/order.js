const express = require('express');
const router = express.Router();
const {userAuth, adminAuth} = require('../middleware_auth/checkAuth');
const {findAllOrders, findAOrder, createOrder, deleteOrder} = require('../controllers/order')

//get all orders
router.get('/', adminAuth, findAllOrders);

//get a particular order
router.get('/:id', userAuth, findAOrder);

//create a order
router.post('/', userAuth, createOrder);

//Delete a order
router.delete('/:id', adminAuth, deleteOrder);

module.exports = router;