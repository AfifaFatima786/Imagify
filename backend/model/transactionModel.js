const mongoose=require('mongoose');

const transactionSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    plan:{
        type:String,
        required:true,
    },
    
    amount:{
        type:Number,
        required:true
    },
    credits:{
        type:Number,
        required:true
    },

    payment:{
        type:Boolean,
        deafult:false
    },
    date:{
        type:Number,

    }
    

});

module.exports=mongoose.models.transaction || mongoose.model("transaction",transactionSchema);