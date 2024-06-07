import pandas as pd
import numpy as np
from flask import Flask , request, jsonify
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def most_popular_movies(number, ratings):
    avg_ratings  = ratings.groupby('movieId')['rating'].mean()
    top_movies = avg_ratings.sort_values(ascending=False).head(number).index.tolist()
    return top_movies


@app.route('/api/movies/popular-movies', methods = ['POST']) 
def get_popular_movies(): 
    data = request.get_json()
    ratings = pd.DataFrame(data["ratings"])
    movies = pd.DataFrame(data["movies"])
    n = 10
    popular_movies = most_popular_movies(n, ratings)
    
    movies_titles = movies[movies['movieId'].isin(popular_movies)]['movieId'].tolist()
    return jsonify({'content': movies_titles}),200

def find_similar_titles(movie_title_input, movies): 
    matching_movies = movies[movies['title'].str.contains(movie_title_input, case=False, na=False)]
    return matching_movies['_id'].tolist()


@app.route('/api/movies/similar-movies', methods = ['POST']) 
def get_similar_movies():  
    try :
        data = request.get_json()
        movies = pd.DataFrame(data["movies"])
        movie_title_input = data["movie_title"]
        similar_titles = find_similar_titles(movie_title_input, movies)
        respone = {"_id": similar_titles}
        return jsonify(respone),200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
def create_matrix(df):
    print("Processing Data Into Matrix Format...")
    N = len(df['userId'].unique())
    M = len(df['movieId'].unique())
    user_mapper = dict(zip(np.unique(df["userId"]), list(range(N))))
    movie_mapper = dict(zip(np.unique(df["movieId"]), list(range(M))))
    user_inv_mapper = dict(zip(list(range(N)), np.unique(df["userId"])))
    movie_inv_mapper = dict(zip(list(range(M)), np.unique(df["movieId"])))
    user_index = [user_mapper[i] for i in df['userId']]
    movie_index = [movie_mapper[i] for i in df['movieId']]
    X = csr_matrix((df["rating"], (movie_index, user_index)), shape=(M, N))
    print("Matrix Created Successfully!")
    return X, user_mapper, movie_mapper, user_inv_mapper, movie_inv_mapper

def find_similar_movies(movie_id, X, movie_mapper, movie_inv_mapper, k ):
    print("Finding Similar Movies...")
    if movie_id not in movie_mapper:
        print(f"Movie ID {movie_id} Not Found!")
        return []
    movie_ind = movie_mapper[movie_id]
    movie_vec = X[movie_ind]
    k += 1
    kNN = NearestNeighbors(n_neighbors=k, algorithm="brute", metric='cosine')
    kNN.fit(X)
    movie_vec = movie_vec.reshape(1, -1)
    neighbours = kNN.kneighbors(movie_vec, return_distance=False)
    neighbour_ids = [movie_inv_mapper[n] for n in neighbours[0][1:]]
    return neighbour_ids

def get_movie_id_from_title(movie_title_input, movies):
    selected_movie = movies[movies['title'].str.contains(movie_title_input, case=False, na=False, regex=False)]

    if selected_movie.empty:  # Check if the DataFrame is empty
        print(f"No movie found matching the title: {movie_title_input}")
        return None  # Return None or an appropriate value to handle this case in the calling function

    return selected_movie.iloc[0].movieId



@app.route('/api/movies/recommendations', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    ratings = pd.DataFrame(data['ratings'])
    movies = pd.DataFrame(data['movies'])
    movie_title_input = data['movie_title']
    X, user_mapper, movie_mapper, user_inv_mapper, movie_inv_mapper = create_matrix(ratings)
    if movie_title_input is None:
        return jsonify({"error": "Missing 'movie_title' in the request."}), 400
    movie_id = get_movie_id_from_title(movie_title_input, movies)
    
    if movie_id:
        n_recommendations = data.get('n_recommendations', 10)
        similar_ids = find_similar_movies(movie_id, X, movie_mapper, movie_inv_mapper, k=n_recommendations)
        respone = {"content": similar_ids}
        return jsonify(respone),200
    return jsonify({"error": "Movie not found."}), 404

if __name__ == "__main__" : 
    app.run(debug=True, host='127.0.0.1', port=8800)
