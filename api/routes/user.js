const express = require('express');
const router = express.Router();
const {findAllUsers, findAUser, createUser, logIn} = require('../controllers/user')
const { adminAuth, userAuth } = require('../middleware_auth/checkAuth');

//get all users
router.get('/', adminAuth, findAllUsers);

//get a particular user
router.get('/:id', userAuth, findAUser);

//create user using sign up
router.post('/signup', createUser);

router.post('/login', logIn);

module.exports = router;