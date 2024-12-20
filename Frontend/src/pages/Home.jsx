import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import { useContext } from 'react';
import {userDataContext}  from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound] = useState(false)
    const [ waitingForDriver, setWaitingForDriver] = useState(false)
    const [ pickupActive, setPickupActive ] = useState(true)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ loadingSuggestions, setLoadingSuggestions ] = useState(false)
    const [ error,setError] = useState(false)
    const [ fare, setFare ] = useState('')
    const [ vehicleType, setVehicleType ] = useState('');
    const [ ride, setRide ] = useState(null)

    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const tripRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)

    const navigate = useNavigate()
    const { user } = React.useContext(userDataContext)

    const {socket} = useContext(SocketContext)
    useEffect(()=>{
        if(!user) return

        socket.emit("join",{userType:"user",userId:user._id})
    },[user])

    // confrim ride handler
    useEffect(() => {
        const rideConfirmedHandler = (data) => {
            setVehicleFound(false);
            setWaitingForDriver(true);
            setVehiclePanel(false);
            setRide(data);
            console.log('Ride confirmed', data);
        };

        socket.on('ride-confirmed', rideConfirmedHandler);

    }, [socket]);

    socket.on('ride-started',(ride)=>{
        setWaitingForDriver(false)
        navigate('/riding', {state:{ride:ride}})
    })

    const submitHandler = (e) => {
        e.preventDefault()
    }

    const handlePickupChange = async(e) => {
        setPickup(e.target.value)
        const token = localStorage.getItem('token')
        if(!token){
            window.location.href = '/user/login'
            return
        }
        setLoadingSuggestions(true)
        try{
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions?input=${e.target.value}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            if(response.status === 500)
                 setPickupSuggestions([])

            const suggestions = response.data || []
            setPickupSuggestions(suggestions.map(elem => elem.description))
            setLoadingSuggestions(false)
            setError(false)
        } catch {
            setError(true)
            setPickupSuggestions([])
            setLoadingSuggestions(false);
        }
    }

    const handleDestinationChange = async(e) => {
        if(pickup.length == 0) setPickup('Current Location')
        setDestination(e.target.value)
        const token = localStorage.getItem('token')

        if(!token){
            window.location.href = '/user/login'
            return
        }
        setLoadingSuggestions(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${token}`
                }
    
            })
            if(response.status === 500)
                setDestinationSuggestions([]);
            const suggestions = response.data || []
            setDestinationSuggestions(suggestions.map(elem => elem.description))
            setLoadingSuggestions(false)
            setError(false)
        } catch {
            setError(true)
            setDestinationSuggestions([])
            setLoadingSuggestions(false);
        }
    }
    
    const findTrip = async () => {
        setVehiclePanel(true);
        setPanelOpen(false);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found. User might not be authenticated.');
                alert('You need to be logged in to find a trip.');
                navigate('/user/login');
                return;
            }
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFare(response.data.fare);
        } catch (err) {
            console.log(err);
        }
    }

    async function createRide(vehicleType){
        const rideData = {pickup, destination, vehicleType}

        try{
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found. User might not be authenticated.');
                navigate('/user/login');
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, rideData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.status === 201) {
                console.log('Ride created successfully:', response.data);
            } else {
                console.error('Unexpected response status:', response.status);
            }
        }catch(err){
            console.log(err.response.data)
        }

    }

    // gsap to open location panel
    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(tripRef.current, {
                color: 'white'
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(tripRef.current, {
              color: 'black'
          })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])

    
    // gsap to open vehicle panel
    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    // gsap to open confirm ride panel
    useGSAP(function () {
      if (confirmRidePanel) {
          gsap.to(confirmRidePanelRef.current, {
              transform: 'translateY(0)'
          })
      } else {
          gsap.to(confirmRidePanelRef.current, {
              transform: 'translateY(100%)'
          })
      }
  }, [ confirmRidePanel ])

    // gsap to open looking for driver
    useGSAP(function () {
      if (vehicleFound) {
          gsap.to(vehicleFoundRef.current, {
              transform: 'translateY(0)'
          })
      } else {
          gsap.to(vehicleFoundRef.current, {
              transform: 'translateY(100%)'
          })
      }
    },[vehicleFound])

    // gsap to open waiting for driver
    useGSAP(function () {
      if (waitingForDriver) {
          gsap.to(waitingForDriverRef.current, {
              transform: 'translateY(0)'
          })
      } else {
          gsap.to(waitingForDriverRef.current, {
              transform: 'translateY(100%)'
          })
      }
    },[waitingForDriver])

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="uber image" />
            <div className='h-screen w-screen'>
                <LiveTracking/>
            </div>

            {/* Location Search Panel */}
            <div className='absolute h-screen top-0 w-full flex flex-col justify-end'>
              <div className='h-[30%] p-6 py-top-2 bg-white relative'>
                <h5 onClick={() => setPanelOpen(!panelOpen)} ref={panelCloseRef} className='opacity-0 absolute left-3 top-3 text-2xl'><i className="ri-arrow-down-wide-fill"></i></h5>
                <h4 ref = {tripRef} className='text-2xl font-bold'>Find a trip</h4>
                <form onSubmit={(e) => submitHandler(e)}>
                    <div className="absolute left-9 top-[70px] circle"><i class="ri-circle-fill"></i></div>
                    <div className="line absolute h-10 w-[1.5px] top-[47%] left-11 bg-black rounded-full"></div>
                    <div className="absolute rectangle left-9 top-[130px]"><i class="ri-rectangle-fill"></i></div>
                    <input 
                    className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-1' 
                    type="text" placeholder='Add a Pick-up location' 
                    value={pickup} 
                    onClick={()=>{setPanelOpen(true); setPickupActive(true)}}
                    onChange={handlePickupChange} 
                    />
                    <input 
                    className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3' 
                    type="text" placeholder='Add your destination' 
                    value={destination} 
                    onClick={()=>{setPanelOpen(true); setPickupActive(false)}}
                    onChange={handleDestinationChange} 
                    />
                </form>
                {panelOpen && <button onClick={findTrip}
                    className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                    Find Trip
                </button>}
              </div>
        
    
              <div ref={panelRef} className='h-0 bg-white'>
                {error ? <div className="p-3 text-red-500">{error}</div>: 
                    (
                        loadingSuggestions ? <div className="p-3">Loading...</div> :
                        (
                            pickupActive && pickupSuggestions.length === 0  || !pickupActive && destinationSuggestions.length === 0 ? <div className="p-3">No suggestions found</div> :
                            <LocationSearchPanel suggestions={pickupActive === true ? pickupSuggestions : destinationSuggestions} pickupActive={pickupActive} setVehiclePanel={setVehiclePanel} setPanelOpen={setPanelOpen} setPickup={setPickup} setDestination={setDestination}/>
                        )
                    )
                }   
              </div>
            </div>

            {/* Vehicle Panel */}
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
              <VehiclePanel fare={fare} setVehicleType={setVehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel}/>
            </div>

            {/* Confirm ride panel */}
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
              <ConfirmRide createRide={createRide} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} setConfirmRidePanel={setConfirmRidePanel} pickup={pickup} destination={destination} setVehiclePanel={setVehiclePanel}/>
            </div>

            {/* Looking for driver page */}
            <div ref = {vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
              <LookingForDriver pickup={pickup} destination={destination} fare={fare} vehicleType ={vehicleType} setVehicleFound={setVehicleFound}/>
            </div>

            {/* Waiting for driver page */}
            <div ref= {waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
              <WaitingForDriver vehicleType={vehicleType} ride={ride} waitingForDriver={waitingForDriver} setWaitingForDriver={setWaitingForDriver}/>
            </div>
        </div>
    )
}

export default Home
