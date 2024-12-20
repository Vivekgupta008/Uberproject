import { useGSAP } from '@gsap/react'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import FinishRide from '../components/FinishRide'
import { useLocation } from 'react-router-dom'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const location = useLocation()
    const finishRideRef = useRef(null)
    const rideData = location.state?.ride

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRideRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRideRef.current, {
                transform: 'translateY(100%)'
            })}
    }, [ finishRidePanel ])

    return (
    <div className='h-screen relative'>
        <div className='fixed p-3 top-0 flex items-center justify-between w-screen '>
            <img className='w-16' src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'></img>
            <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i class="text-lg font-medium ri-logout-box-r-line"></i>
            </Link>
        </div>
        <div className='h-4/5'>
            <img className='object-cover w-full h-full' src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" alt="" />
        </div>
        <div className='h-1/5 p-6 bg-yellow-400 flex items-center justify-center flex-col rounded-lg gap-2'
        onClick={()=>{setFinishRidePanel(true)}}>
            <h5 className='p-1 text-center w-[93%] absolute bottom-24'><i className="text-3xl text-black ri-arrow-down-wide-line"></i></h5>
            <h4 className='text-medium font-semibold'>4 KM away</h4>
            <button className='flex justify-center bg-green-600 text-white font-semibold p-2 w-36 rounded-lg'>Complete Ride</button>
        </div>

        <div ref= {finishRideRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
              <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel}/>
        </div>
    </div>
    )
}

export default CaptainRiding