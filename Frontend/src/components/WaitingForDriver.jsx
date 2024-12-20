import React from 'react'

const WaitingForDriver = ({setWaitingForDriver , vehicleType, ride}) => {
    const image = {
        'car':'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png',
        'bike':'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
        'auto':'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png'
    }
  return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                setWaitingForDriver(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

        <div className='flex items-center justify-between'>
            <img className='h-12' src={image[vehicleType]} alt="" />
            <div className='text-right'>
                <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname + ' ' + ride?.captain.fullname.lastname}</h2>
                <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                <p className='sm text-gray-600'>Maruti Suzuki Alto</p>
                <h1 className='text-lg font-semibold'>{ride?.otp}</h1>
            </div>
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
        </div>
     </div>
  )
}

export default WaitingForDriver;