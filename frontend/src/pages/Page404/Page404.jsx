import React from 'react';
import './Page404.css';
import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <div className='container'>
     <div className="bubble"></div>
     <div className="bubble"></div>
    <div className="bubble"></div>
     <div className="bubble"></div>
     <div className="bubble"></div>
     <div className="main">
     <h1>404</h1>
     <p>Not Found<br/>la page que vous recherchez est introuvable</p><br/>
      <Link to="/"> <button type="button" className='btn' >Go to home</button></Link>
      </div>
    </div>
  )
}

export default Page404
