import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Logout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token') == null) {
      window.location.replace('https://main.drvznpngbg4y4.amplifyapp.com/login');
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = e => {
    e.preventDefault();

    axios({
      method: 'post',
      url: 'https://djminesbackend.respuestadigital.com.ar/api/v1/users/auth/logout/',
      headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type':'application/json'
      }
    })
    .then(response => response.data)
      .then(data => {
        localStorage.clear();
        window.location.replace('https://main.drvznpngbg4y4.amplifyapp.com/login');
      });

    const responseSuccessHandler = response => {
      return response;
    };
    
    //If an error occurs with the token in logout, then go to login
    const responseErrorHandler = error => {
      if (error.response.status === 401) {
        localStorage.clear();
        window.location.replace('https://main.drvznpngbg4y4.amplifyapp.com/login');
      }
    
      return Promise.reject(error);
    }
    
    axios.interceptors.response.use(
      response => responseSuccessHandler(response),
      error => responseErrorHandler(error)
    );
  };

  return (
    <div>
      {loading === false && (
        <>
          <h1>Are you sure you want to logout?</h1>
          <input type='button' value='Logout' onClick={handleLogout} />
        </>
      )}
    </div>
  );
};

export default Logout;
