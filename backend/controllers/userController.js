const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const razorpay=require('razorpay')
const dotenv=require('dotenv')
const transactionModel=require('../model/transactionModel');
const cookieOptions = require("../utils/cookieOptions");

dotenv.config()

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

            res.cookie("token", token,cookieOptions);
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
        console.log("cookie not setting")
            res.cookie("token", token,cookieOptions);
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
const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})



module.exports.paymentRazorpay=async(req,res)=>{
    try{
        const userId=req.user.id
        const {planId}=req.body;
        // console.log(userId+"y hai")
         console.log(planId)

        const userData=await userModel.findById(userId)

        if(!userId || !planId){
            return res.json({success:false,message:'Missing Details'})
        }

        let credits,plan,amount,date

        switch(planId){
            case 'Basic':
                plan='Basic'
                credits=100
                amount=10
                break;

            case 'Advanced':
                plan='Advanced'
                credits=500
                amount=50
                break;

            case 'Business':
                plan='Business'
                credits=5000
                amount=250
                break;

            default:
                return res.json({success:false,message:'plan not found'});
            
        }

        date=Date.now();

        const transactionData={
            userId,plan,amount,credits,date
        }

        const newTransaction=await transactionModel.create(transactionData)

        const options={
            amount:amount*100,
            currency:process.env.CURRENCY,
            receipt:newTransaction._id
        }

        await razorpayInstance.orders.create(options,(error,order)=>{
            if(error){
                console.log(error)
                return res.json({success:false,message:error})
            }

            res.json({success:true,order})

        })



    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}



module.exports.verifyRazorpay=async(req,res)=>{
    try{
        const {razorpay_order_id}=req.body;

        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status=='paid'){
            const transactionData=await transactionModel.findById(orderInfo.receipt)
            if(transactionData.payment){
                return res.json({success:false,message:'Payment Failed'})
            }

            const userData=await userModel.findById(transactionData.userId)

            const creditBalance=userData.creditBalance+transactionData.credits

            await userModel.findByIdAndUpdate(userData.id,{creditBalance})

            await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})

            res.json({success:true,message:'Credits Added'})
        }else{
            res.json({success:false,message:'Payment Failed'})
        }

    }
    catch(error){
        console.log(error)
        res,json({success:false,message:error.message})
    }
}