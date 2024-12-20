import React, { useEffect } from 'react'
import { useContext ,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
const UserProtectWrapper = ({children}) => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { user, setUser } = useContext(userDataContext)

    useEffect(()=>{
        if(!token){
            navigate('/user/login');
        }  

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data)
            }
        })
        .catch(err => {
            console.log(err)
            localStorage.removeItem('token')
            navigate('/user/login')
        })
    },[token])
    
    return (
    <>{children}</>
    )
}

export default UserProtectWrapper