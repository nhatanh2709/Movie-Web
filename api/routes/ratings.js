const router = require("express").Router()
const Rating = require("../models/Rating");
const verify = require("../verifyToken")


router.post("/", verify, async (req, res) => {
    const data = await Rating.findOne({
        userId: req.body.userId,
        movieId: req.body.movieId,
    })
    if(data) {
        await Rating.findByIdAndDelete(data._id)
    }
    const newRating = new Rating(req.body);
    try {
        const SaveRating = await newRating.save();
        res.status(200).json(SaveRating)
    } catch(err) {
        res.status(500).json(err)
    }
})

router.get("/", verify, async (req, res) => {
    try {
        const data = await Rating.findOne({
            userId: req.query.userId,
            movieId: req.query.movieId,
        })
        res.status(200).json(data)
    } catch(err) {
        res.status(500).json(err)
    }
    
})

router.get("/getAll", verify, async(req, res) => {
    try {
        const data = await Rating.aggregate([
            {
                $project: {
                    userId: "$userId",
                    movieId : "$movieId",
                    rating: "$ratings",
                }
            }
        ])
        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
})
module.exports = router