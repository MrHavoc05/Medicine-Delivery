import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


// login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = createToken(user._id);
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, cartData: user.cartData } });
    
        }catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server error" });
        }

}

const createToken = (id) => {  
    return jwt.sign({id},process.env.JWT_SECRET

    )
}

// register user
export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

       
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
             const newUser = new userModel({
                name: name,
                email: email,
                password: hashedPassword,
                cartData: {}

            });

        
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true, token})



       
    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Server error" });
    }

}

export default { loginUser , registerUser };

