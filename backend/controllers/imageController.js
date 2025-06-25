

const axios = require("axios");
const userModel = require("../model/userModel");
const FormData = require("form-data");

const generateImage = async (req, res) => {
    try {
        
        const userId = req.user?.id;
        const { prompt } = req.body;

        if (!userId || !prompt) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.creditBalance <= 0) {
            return res.json({
                success: false,
                message: "No credit balance",
                creditBalance: user.creditBalance
            });
        }

        
        const formData = new FormData();
        formData.append('prompt', prompt);

        const { data } = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIP_DROP_API,
                    ...formData.getHeaders()
                },
                responseType: 'arraybuffer'
            }
        );

        
        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        
        user.creditBalance -= 1;
        await user.save();

       
        res.json({
            success: true,
            message: "Image Generated",
            creditBalance: user.creditBalance,
            resultImage
        });

    } catch (err) {
        console.log("Error in generateImage:", err.message);
        res.json({ success: false, message: err.message });
    }
};
module.exports = { generateImage };