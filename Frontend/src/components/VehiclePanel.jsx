import React from 'react'

const VehiclePanel = (props) => {

    const vehicles = [
        {
            id: 1,
            name: 'UberGo',
            image: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
            seats: 4,
            type: 'car',
            price: props.fare.car,
            distance: '2 minutes away',
            desc: 'Affordable, everyday rides'
        },
        {
            id: 2,
            name: 'Moto',
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
            seats: 1,
            type: 'bike',
            price: props.fare.bike,
            distance: '3 minutes away',
            desc: 'Affordable motorcycle rides'
        },
        {
            id: 3,
            name: 'UberAuto',
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
            seats: 3,
            type: 'auto',
            price: props.fare.auto,
            distance: '1 minute away',
            desc: 'Affordable auto rides'
        }
    ]

    return (
        <div className='bg-white p-4 rounded-2xl shadow-lg'>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h3>
            {vehicles.map((vehicle,idx) => (
                <div key={idx} onClick={()=>{props.setVehicleType(vehicles[idx].type); props.setConfirmRidePanel(true)}} className='flex border-2 active:border-black  mb-2 rounded-xl w-full p-3  items-center justify-between'>
                    <img className='h-10' src={vehicle.image} alt="" />
                    <div className='ml-2 w-1/2'>
                        <h4 className='font-medium text-base'>{vehicle.name} <span><i className="ri-user-3-fill"></i>{vehicle.seats}</span></h4>
                        <h5 className='font-medium text-sm'>{vehicle.distance} </h5>
                        <p className='font-normal text-xs text-gray-600'>{vehicle.desc}</p>
                    </div>
                    <h2 className='text-lg font-semibold'>₹ {vehicle.price}</h2>
                </div>
            ))}
        </div>
    )
}

export default VehiclePanel
