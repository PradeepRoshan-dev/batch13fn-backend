const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    age:{
        type:Number,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    }
})


userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id, email: this.email, name: this.name }, 
        process.env.JWT_SECRET || "mysecretkey",                
        { expiresIn: "1h" }                                   
    );
    return token;
};

module.exports = mongoose.model("User", userSchema);
