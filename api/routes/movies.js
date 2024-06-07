const router = require("express").Router();
const Movie = require("../models/Movie");
const Rating = require("../models/Rating");
const verify = require("../verifyToken")
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body);
        const newSlug = req.body.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, '-').toLowerCase();  
        newMovie.Slug = newSlug;
        try {
            const SavedMovie = await newMovie.save();
            res.status(200).json(SavedMovie);

        } catch (err) {

            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed!");
    }
})
//Update the movie
router.put("/:id", verify, async (req, res) => {
    {
        try {
            const updateMovie = await Movie.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updateMovie);
        } catch (err) {
            res.status(500).json(err);
        }
    }
})
//Delete the movie 
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("The movie has been deleted...");
        } catch (err) {
            
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed!");
    }
});




//Find the movie 
router.get("/find/:id", verify, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
        
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/findName/:Slug" , verify, async (req, res) => {
    try {
        const movie = await Movie.aggregate([
            { $match: { Slug: req.params.Slug } },
            
        ]);
        res.status(200).json(movie[0]);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.get("/changeSlug/:Slug", verify, async(req, res) => {
    try {
        const name = req.params.Slug;
        const newSlug = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, '-').toLowerCase();  
        res.status(200).json(newSlug); 
    } catch(err) {
        res.status(500).json(err);
    }
})

//Random Movie 
router.get("/random", verify, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if (type === "series") {
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 3 } },
            ]);
        } else {
            movie = await Movie.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 3 } },
            ]);
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL 
router.get("/", verify, async (req, res) => {
    {
        try {
            const movies = await Movie.find();
            res.status(200).json(movies.reverse());
        } catch (err) {
            res.status(500).json(err);
        }
    }
})
//Get Series or Movie
router.get("/query", verify, async (req, res) => {
    const isSeriesQuery = req.query.isSeries;
    const genreQuery = req.query.genre;
    let list = [];
    try {
        if (isSeriesQuery === "true") {
            if (genreQuery) {
                list = await Movie.aggregate([
                    {
                        $match: {
                            isSeries: true,
                            genre: genreQuery,
                        }
                    },
                ]);
            }
            else {
                list = await Movie.aggregate([
                    {
                        $match: {
                            isSeries: true,
                        }
                    },
                ])
            }

        }
        else {
            if (genreQuery) {
                list = await Movie.aggregate([
                    {
                        $match: {
                            isSeries: false,
                            genre: genreQuery,
                        }
                    }
                ])
            }
            else {
                list = await Movie.aggregate([

                    { $match: { isSeries: false } },
                ]);
            }
        }
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.get("/getInfo", verify, async (req, res) => {
    try {
        const data = await Movie.aggregate([
            {
                $project: {
                    movieId: "$_id",
                    title: "$title",
                    genre: "$genre"
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post("/interactive/post/:id", verify, async (req, res) => {
    const beforeComment = await Movie.findById(req.params.id)
    const newComment = {
        id: req.body.id,
        comment: req.body.comment,
        timestamp: new Date()
    }
    const afterComment = [...beforeComment.Comment, newComment]
    const data = await Movie.findByIdAndUpdate(
        req.params.id,
        {Comment : afterComment},
        {new: true}
    )
    res.status(200).json(data)
})

router.get("/interactive/get/:id", verify , async(req,res) => {
    try {
        const data = await Movie.findById(req.params.id);
        res.status(200).json(data.Comment)
    } catch(err) {

        res.status(500).json(err)
    }
})

router.get("/view/mostView", verify, async(req,res) => {
    try {
        
        const movies = await Movie.find().sort({View : -1}).limit(10);
        res.status(200).json(movies);
    } catch(err) {
        res.status(500).json(err);
    }
})
module.exports = router