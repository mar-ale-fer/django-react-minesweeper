import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

const Logout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token') == null) {
      window.location.replace('http://localhost:3000/login');
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = e => {
    e.preventDefault();

    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/v1/users/auth/logout/',
      headers: {
          'content-type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
      }
    })
    .then(response => response.data)
      .then(data => {
        console.log(data);
        localStorage.clear();
        window.location.replace('http://localhost:3000/login');
      });
  };

  return (
    <div>
      {loading === false && (
        <Fragment>
          <h1>Are you sure you want to logout?</h1>
          <input type='button' value='Logout' onClick={handleLogout} />
        </Fragment>
      )}
    </div>
  );
};

export default Logout;
