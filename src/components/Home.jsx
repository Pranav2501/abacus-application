// src/components/Home.jsx
import React from 'react';

const Home = ({ user, logout }) => {
  return (
    <div>
      <h1>Welcome to the Abacus Application, {user.email}</h1>
      <p><a href="/settings">Start</a></p>
    </div>
  );
};

export default Home;
