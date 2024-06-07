
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from "./pages/Home/Home";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import './app.scss'
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import { useContext } from "react";
import { AuthContext } from "./context/authContext/AuthContext";
import ListList from './pages/listsList/ListList';
import List from './pages/list/List';
import NewList from './pages/newList/NewList';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route exact path="/" element={user ? <Home /> : <Navigate to="/login"/>} />
        {
          user &&
          <>
            
            <Route path="/users" element={<UserList />} />
            <Route path="/user/:userId" element={<User />} />
            <Route path="/newUser" element={<NewUser />} />
            <Route path="/movies" element={<ProductList />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/newproduct" element={<NewProduct />} />
            <Route path='/lists' element={<ListList/>}/>
             <Route path='/list/:listId' element={<List/>}/>
            <Route path='newList' element={<NewList/>}/>
          </>
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
