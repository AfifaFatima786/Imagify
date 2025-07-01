const jwt = require('jsonwebtoken');
const userModel = require("../model/userModel");

module.exports = async function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorised. Login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        const user=await userModel.findById(decoded.id)
        
        // req.user = user;
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        
        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            creditBalance: user.creditBalance
        };


        if(decoded.id){

            req.user.userId=decoded.id;
        }
       

         
        next(); 
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message });
    }
};
