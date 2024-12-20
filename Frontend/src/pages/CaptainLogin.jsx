import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {captain,setCaptain} = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async(e) => {
    e.preventDefault();
    const captain = {email,password}

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/login`,captain)
    if(response.status === 200){
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token',data.token)
      navigate('/captain-home') 
    }
    
    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
      <img className='w-16 mb-10' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVCO4w_adxK32rCXFeKq3_NbLcR9b_js14w&s'/>
      <form onSubmit={(e) => submitHandler(e)} >
        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='bg-[#eeeeee] mb-7 rounded px-4 py-2 w-full border text-lg placeholder:text-base'
          placeholder="email@example.com" 
          required 
        />
        <h3 className='text-lg font-medium mb-2'>Enter password</h3>
        <input 
         type="password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         className='bg-[#eeeeee] mb-7 rounded px-4 py-2 w-full border text-lg placeholder:text-base'
         placeholder="Password" 
         required 
        />
        <button
        className='bg-[#111] mb-7 text-white font-semibold rounded px-4 py-2 w-full text-lg placeholder:text-base'>
          Login
        </button>
        <p className='text-center'>Join a fleet?<Link to='/captain/signUp' className='text-blue-600'>Register as a captain</Link></p>
      </form>
      </div>
      <div>
        <Link to='/user/login' className='flex justify-center items-center w-full bg-[#d5622d] mb-10 text-white font-semibold rounded px-4 py-2 w-full text-lg placeholder:text-base'>
        Sign in as user</Link>
      </div>
    </div>
  )
}

export default CaptainLogin