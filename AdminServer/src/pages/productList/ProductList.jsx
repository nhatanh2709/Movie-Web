import "./productList.scss";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";

import Slidebar from "../../components/sidebar/Slidebar";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { getMovies } from "../../context/movieContext/apiCalls";
import { deleteMovie } from "../../context/movieContext/apiCalls";
export default function ProductList() {
  const { movies, dispatch } = useContext(MovieContext);
  useEffect(() => {
    getMovies(dispatch)
  }, [dispatch])

  const handleDelete = (id) => {
    deleteMovie(id, dispatch);
  };
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "movie",
      headerName: "Movie",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "genre", headerName: "Genre", width: 120 },
    { field: "year", headerName: "year", width: 120 },
    { field: "limit", headerName: "limit", width: 120},
    { field: "isSeries", headerName: "isSeries", width:120},
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          
          <>
            <Link to={"/product/" + params.row._id} state={{ movie: params.row}}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <Topbar />
      <div className="container">
        <Slidebar />
        <div className="productList">
          <DataGrid
            rows={movies}
            disableSelectionOnClick
            columns={columns}
            pageSize={8}
            checkboxSelection
            getRowId={(r) => r._id}
          />
        </div>
      </div>
    </>
  );
}