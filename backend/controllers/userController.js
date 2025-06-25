const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, name } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        let users = await userModel.findOne({ email });
        if (users) {
            res.json({ success: false, message: "User already registered" });
            return;
        }

        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) return res.send(err.message);

            let user = await userModel.create({
                email,
                password: hash,
                name
            });

            let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            res.cookie("token", token);
            res.json({ success: true, token, user: user.name });
        });

    } catch (err) {
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
};



module.exports.loginUser=async function(req,res){

    try{
    let {email,password}=req.body;

    const user=await userModel.findOne({email})
    if(!user) {
    return res.json({success:false,message:"Email or Password incorrect"});                     
    }
    
    bcrypt.compare(password,user.password,function(err,result){

    if(!result)  
    {    
    return res.json({success:false,message:"Email or Password incorrect"});
    
    }
    else{

    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            res.cookie("token", token);
            res.json({ success: true, token, user: user.name });

    }
    })}

    catch (err) {
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }


}


module.exports.userCredits=async function(req,res){

    try{
        console.log(req.user.id,"id waala")
        const userId=req.user.id;
        
        res.json({success:true,credits:req.user.creditBalance,user:{name:req.user.name}})
    }

    catch (err) {
        console.log(err.message);
        console.log("IDhr error hai dost ");
        res.json({ success: false, message: err.message });
    }


}
