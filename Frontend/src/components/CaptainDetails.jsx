import React from 'react'
import { useContext ,useState} from 'react'
import {CaptainDataContext} from '../context/CaptainContext'

export const CaptainDetails = () => {
    const {captain} = useContext(CaptainDataContext)

    return (
    <div>
        <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3 justify-start'>
                    <img className='h-10 w-10 rounded-full object-cover' src='https://i.pinimg.com/originals/be/a3/49/bea3491915571d34a026753f4a872000.jpg'></img>
                    <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + ' ' + captain.fullname.lastname}</h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹ 150.50</h4>
                    <p className='text-sm font-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-6 bg-gray-50 rounded-xl justfy-center items-start gap-5'>
                <div className='text-center '>
                    <i className="text-3xl mb-2 font-thin ri-timer-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center '>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center '>
                    <i className='text-3xl mb-2 font-thin ri-booklet-line'></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
            </div>
    </div>
  )
}
