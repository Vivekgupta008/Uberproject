import React from 'react'
import axios from 'axios'

const RidePopUp = ({setRidePopUpPanel,setConfirmRidePopUpPanel,ride,confirmRide}) => {

  return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                setRidePopUpPanel(false);
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>New Ride Available</h3>
        <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
            <div className='flex items-center gap-3 justify-start'> 
                <img className='h-10 w-10 rounded-full object-cover' src="https://i.pinimg.com/originals/be/a3/49/bea3491915571d34a026753f4a872000.jpg" alt="" />
                <h2 className='text-lg font-medium capitalize'>{ride?.user.fullname.firstname + ' ' + ride?.user.fullname.lastname}</h2>
            </div>
            <h5 className='text-lg font-semibold'>2.2 KM </h5>
        </div>
        <div className='flex gap-2 justify-between items-center flex-col'>
            <div className='w-full mt-5'>
                {/* Pickup Location */}
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="text-lg ri-map-pin-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium capitalize'>{ride?.pickup.split(',')[0]}</h3>
                        <p className='text-sm -mt-1 text-gray-600 capitalize'>{ride?.pickup}</p>
                    </div>
                </div>
                {/* Destination address */}
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="ri-rectangle-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium capitalize'>{ride?.destination.split(',')[0]}</h3>
                        <p className='text-sm -mt-1 text-gray-600 capitalize'>{ride?.destination}</p>
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
            <button onClick={()=>{setRidePopUpPanel(false); setConfirmRidePopUpPanel(true); confirmRide()}} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Accept</button>
            <button onClick={()=>{setRidePopUpPanel(false)}} className='w-full mt-1 bg-gray-300 text-gray-700 font-semibold p-2 rounded-lg'>Ignore</button>
        </div>
    </div>
  )
}

export default RidePopUp