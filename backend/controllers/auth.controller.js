import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {generateTokenAndSetCookie} from '../lib/utils/generateToken.js';

export const signup = async  (req, res) => {
    try {
        // Check if required fields exist
        if (!req.body.email || !req.body.username || !req.body.password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let {fullName, username, password, email} = req.body;

        // trim and normalize input
        fullName = fullName.trim();
        username = username.trim();
        email = email.trim().toLowerCase();

        // to check email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // to check if there is a existing username
        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({error: "Username is already taken"});
        }

        // to check if there is a existing email
        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json({error: "Email is already taken"});
        }

        // check password length
        if(password.length < 6) {
            return res.status(400).json({error: "Password must be at least 6 characters long"});
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // to create new user 
        const newUser = new User ({
            fullName,
            username,
            email,
            password:hashedPassword,
        })

        if(newUser) {
            await newUser.save();
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,
                link: newUser.link,
            })
        }else {
            res.status(400).json({error: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const login = async  (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ""); // to avoid error

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link,
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const logout = async  (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0}); // expired and will remove from user's browser
        res.status(200).json({message: "Logged out successfully."})
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}
