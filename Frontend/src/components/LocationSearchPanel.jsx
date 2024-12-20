import React, { useState, useEffect } from 'react'
import axios from 'axios'

const LocationSearchPanel = ({ suggestions, pickupActive, setVehiclePanel, setPanelOpen,setPickup, setDestination }) => {
    const [locations, setLocations] = useState([])
    const [currentLocation, setCurrentLocation] = useState('')

    const handleSuggestionClick = (idx) => {
        if (pickupActive) {
            setPickup(suggestions[idx])
        } else {
            setDestination(suggestions[idx])
        }
        // setVehiclePanel(true)
        // setPanelOpen(false)
    }
    
    return (
        <div>
            {suggestions.map((elem, idx) => (
                <div 
                    onClick={() => {
                        handleSuggestionClick(idx)
                    }} 
                    key={idx} 
                    className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'
                >
                    <h2 className='bg-[#eee] h-8 flex items-center justify-center w-8 rounded-full'>
                        <i className="ri-map-pin-fill"></i>
                    </h2>
                    <h4 className='font-medium'>{elem}</h4>
                </div>
            ))}
        </div>
    )
}

export default LocationSearchPanel
