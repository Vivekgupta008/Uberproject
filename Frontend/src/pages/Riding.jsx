import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import { useEffect,useContext,useState } from 'react'

const Riding = () => {
    const location = useLocation()
    const ride = location.state?.ride
    const {Socket } = useContext(SocketContext)
    const navigate = useNavigate()

    Socket.on('ride-ended',()=>{
        navigate('/home')
    })

    return (
    <div className='h-screen'>
        <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className="text-lg font-medium ri-home-2-line "></i>
        </Link>
        <div className='h-1/2'>
            <img className='object-cover w-full h-full' src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" alt="" />
        </div>
        <div className='h-1/2 p-4'>
        <div className='flex items-center justify-between'>
            <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
            <div className='text-right'>
                <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname + ' ' + ride?.captain.fullname.lastname}</h2>
                <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                <p className='sm text-gray-600'>Maruti Suzuki Alto</p>
            </div>
        </div>            
        <div className='flex gap-2 justify-between items-center flex-col'>
            <div className='w-full mt-5'>
                {/* Destination address */}
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i class="ri-map-pin-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium'>{ride?.destination.split(',')[0]}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                    </div>
                </div>
                {/* Payment */}
                <div className='flex items-center gap-5 p-3'>
                    <i className="ri-money-rupee-circle-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium'>₹ {ride?.fare}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                    </div>
                </div>
            </div>
        </div>

        <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Make a payment</button>
        </div>
    </div>
    )
}

export default Riding