import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import Account from "./pages/Account";
import Places from "./pages/Places";
import Form from "./pages/Form";
import Place from "./pages/Place";
import Bookings from "./pages/Bookings";
import BookingInfo from "./pages/BookingInfo";
import axios from "axios";
import { UserContextProvider } from "./UserContext";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
console.log(import.meta.env.VITE_API_BASE_URL);
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/account" element={<Account />}></Route>
          <Route path="/account/places" element={<Places />}></Route>
          <Route path="account/places/new" element={<Form />}></Route>
          <Route path="account/places/:id" element={<Form />}></Route>
          <Route path="/place/:id" element={<Place />} />
          <Route path="/account/bookings" element={<Bookings />} />
          <Route path="/account/bookings/:id" element={<BookingInfo />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
