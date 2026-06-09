const express = require('express');
const router = express.Router();
const User = require('../Schema/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../auth/middleware');
// post request
router.post('/register', async (req, res) => {
    console.log(req.body);
    const {name, age, email, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({name, age, email, password: hashedPassword});
        await user.save();
        res.status(201).send({message:'User registered successfully',user});
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({message:'Error registering user',error:error.message});
    }
});

//login
router.post("/login", async(req,res)=>{
    const {email, password} = req.body;
    try{
        // const user = await User.findOne({email, password});
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send({message:'User not found'});
        }
        if(user && bcrypt.compareSync(password, user.password)){
              const token = user.generateAuthToken();
              return res.status(200).json({message: 'Login successful',token, user});
        }
        res.status(401).send({message:'Invalid password'});
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({message:'Error logging in user',error:error.message});
    }
})


// get request
router.get('/users', async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).send({message:'Users fetched successfully',users});
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({message:'Error fetching users',error:error.message});
    }
});

//get by user id
router.get('/user/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.status(200).send({message:'User fetched successfully',user});
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({message:'Error fetching user',error:error.message});
    }
});

//update user by id
router.put('/user/:id', async (req, res) => {
    try{
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const user = await User.findByIdAndUpdate(req.params.id, {...req.body, password: hashedPassword});
        res.status(200).send({message:'User updated successfully',user});
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({message:'Error updating user',error:error.message});
    }
});

//delete user by id
router.delete('/user/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).send({message:'User deleted successfully',user});
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({message:'Error deleting user',error:error.message});
    }
});

module.exports = router;
