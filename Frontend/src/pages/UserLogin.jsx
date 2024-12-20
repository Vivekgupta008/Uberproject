import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { user, setUser } = useContext(userDataContext);
  const navigate = useNavigate();
  const location = useLocation();


  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = { email, password };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, newUser);
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/home');
      }

      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img className="w-16 mb-10" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber logo" />
        <form onSubmit={submitHandler}>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 w-full border text-lg placeholder:text-base"
            placeholder="email@example.com"
            required
          />
          <h3 className="text-lg font-medium mb-2">Enter password</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 w-full border text-lg placeholder:text-base"
            placeholder="Password"
            required
          />
          <button className="bg-[#111] mb-7 text-white font-semibold rounded px-4 py-2 w-full text-lg">
            Login
          </button>
          <p className="text-center">
            New here? <Link to="/user/signUp" className="text-blue-600">Create new account</Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to="/captain/login"
          className="flex justify-center items-center bg-[#10b461] mb-10 text-white font-semibold rounded px-4 py-2 w-full text-lg"
        >
          Sign in as captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;

