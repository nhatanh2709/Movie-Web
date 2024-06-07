import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import MovieList from '../movie-list/MovieList'
const ListRating = () => {
    const [ratings, setRatings] = useState([]);
    const [movies, setMovies] = useState([]);
    const [lists, setLists] = useState([])
    useEffect(() => {
        const getRating = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_URL}/api/ratings/getAll`, {
                    headers: {
                        token: "Bearer "+JSON.parse(localStorage.getItem("user")).accessToken
                    }
                })
                const RatingList = res.data;
                const newRatings = RatingList.map(item => item);
                setRatings(newRatings);
            } catch (err) {
                console.log(err)
            }
        }
        const getUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_URL}/api/movies/getInfo`, {
                    headers: {
                        token: "Bearer "+JSON.parse(localStorage.getItem("user")).accessToken
                    }
                })
                const MoviesList = res.data;
                const newMovie = MoviesList.map(item => item);
                setMovies(newMovie);
            } catch (err) {
                console.log(err);
            }
        }
        getRating();
        getUser();
    }, [])

    useEffect(() => {
        const findHighestRatingMovies = async () => {
            try {
                const res = await axios.post(`https://pythonserver-6.onrender.com/api/movies/popular-movies`, {
                    ratings: ratings,
                    movies: movies
                })
                setLists(res.data)

            } catch (err) {
                console.log(err)
            }
        }
        if (ratings.length !== 0 && movies.length !== 0) {
            findHighestRatingMovies()
        }
    }, [ratings, movies])
    
    return (
        <>
            <div className='section__header mb-2'>
                <h2>Highest Rating</h2>
            </div>
            { 
                lists.length !== 0 && <MovieList content = {lists.content}/> 
            }
        </>
    )
}

export default ListRating
