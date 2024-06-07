const router = require("express").Router();
const User = require("../models/User");
const Movie = require("../models/Movie")
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken")
//Update ACCOUNT

router.put("/change/:id", verify, async (req, res) => {
    try {
        const oldUser = await User.findById(req.params.id);
        let password = oldUser.password;
        if(req.body.password.length !== 0) {
            const newPassword = req.body.password;
            const encryptionPassWord = CryptoJS.AES.encrypt(
                newPassword,
                process.env.SECRET_KEY
            ).toString();
            password = encryptionPassWord;
        }
        let updateData = {
            username: req.body.username || oldUser.username,
            profilePic: req.body.profilePic || oldUser.profilePic,
            age: req.body.age || oldUser.age,
            city: req.body.city || oldUser.city,
            password : password,
            emai: oldUser.email,
            verify: oldUser.verify,
            FavouriteMovie: oldUser.FavouriteMovie,
            isAdmin: oldUser.isAdmin
        };
        
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        )
        res.status(200).json(updateUser);
       
    } catch(err) {
        res.status(500).json(err);  
    }
})

//Delete Account 
router.delete("/:id", verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted...");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can delete only your account!");
    }
});

//GET 
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc;
        res.status(200).json(info);
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET ALL
router.get("/", verify, async (req, res) => {
    const query = req.query.new;
    if (req.user.isAdmin) {
        try {
            const users = query
                ? await User.find().sort({ _id: -1 }).limit(5)
                : await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to see all users!");
    }
});
//GET USER STATS
router.get("/stats", async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);

    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const user = await User.find().sort({ _id : -1});
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
})
router.post("/new/:id", verify, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            res.status(401).json({message: "User not found"})
        }

        const indexToRemove = user.FavouriteMovie.findIndex(movie => movie.MovieId === req.body.MovieId);
        if (indexToRemove !== -1) {
            return res.status(200).json(user.FavouriteMovie);
        }
        const newListMovie = {
            MovieId: req.body.MovieId
        }
        const afterList = [...user.FavouriteMovie, newListMovie];
        const data = await User.findByIdAndUpdate(
            req.params.id,
            {
                FavouriteMovie: afterList
            }
        )
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})



router.post("/listMovie/:id", verify , async(req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            res.status(401).json({message: "User not found" })
        }
        const FavouriteMovie = user.FavouriteMovie.map(movie => movie.MovieId);

        const MovieData = [];
        for(const MovieId of FavouriteMovie) {
            const MovieInfo = await Movie.findById(MovieId);
            MovieData.push(MovieInfo)
        }
        res.status(200).json(MovieData);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.delete("/delete/:id", verify, async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            res.status(401).json({message: "User not found"})
        }
        const indexToRemove = user.FavouriteMovie.findIndex(movie => movie.MovieId === req.body.MovieId);
        if (indexToRemove === -1) {
            return res.status(404).json({ message: "Movie not found in user's favourites" });
        }
        user.FavouriteMovie.splice(indexToRemove, 1);
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.post("/info/:id", verify, async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        const movie = await Movie.findById(req.body.MovieID);
        if(movie.isFree === true) {
            return res.status(200).json(true);
        }
        if(user.BuyPackage === false) {
            return res.status(200).json(false);
            
        }
        
        const timestamp = new Date();
        if(user.ExpireDate === undefined || user.ExpireDate === null) {
            return res.status(200).json(false);
        }
        const lastBuy = new Date(user.ExpireDate);
        
        if(timestamp < lastBuy) {
            return res.status(200).json(true);
        }
        else {
            res.status(200).json(false)
        }  
    } catch(err) {
        res.status(403).json(err);
    }
})
module.exports = router