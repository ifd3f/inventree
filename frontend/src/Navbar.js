import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function MiniSearch(props) {
  return (
    <div className="form-inline my-2 my-lg-0">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name="search_keyword" />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      <button className="btn btn-primary my-2 my-sm-0">Advanced...</button>
    </div>
  );
}


function Navbar(props) {
  return (
    <header className="app-header navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar">
      <span className="navbar-brand mr-0 mr-md-2" role="button">
        <Link to="/"><h2>Unrefined Stockpile</h2></Link>
      </span>
      <span className="navbar-nav bd-navbar-nav flex-row" role="button">
        <li className="nav-item">
          <Link to="/" className="nav-link active">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/browse" className="nav-link active">Browse</Link>
        </li>
      </span>
      <ul className="navbar-nav ml-md-auto d-md-flex">
        <li className="nav-item">
          <MiniSearch />
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
