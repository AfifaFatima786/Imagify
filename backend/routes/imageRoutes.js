const express = require('express');
const {generateImage}=require('../controllers/imageController')

const userAuth=require('../middlewares/auth')

const imageRouter=express.Router()

imageRouter.post('/generate-image',userAuth,generateImage)

// export default imageRouter
module.exports = imageRouter;  
