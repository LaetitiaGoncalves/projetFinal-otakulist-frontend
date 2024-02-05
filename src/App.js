import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

//Pages
import Home from "./pages/Home";
import Anime from "./pages/Anime";
import Search from "./pages/Search";

//Components
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:id" element={<Anime />} />
        <Route path="/search/:searchTerm" element={<Search />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
