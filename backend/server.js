const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
const userRouter=require("./routes/userRoutes.js")

dotenv.config();

const cookieParser=require("cookie-parser")
const path=require("path");

const connectDB=require("./config/mongodb.js");
const imageRouter = require('./routes/imageRoutes.js');

const PORT=process.env.PORT || 3000
const app=express()

app.use(express.json())


app.use(cors({
  origin: ['https://imagify-nine-phi.vercel.app', 'http://localhost:5173' ], 
  credentials: true                  
}));
app.use(cookieParser());
connectDB()


app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)

app.get('/',(req,res)=>{
    res.send("App working")
})

app.listen(PORT,()=>{console.log("working")})

