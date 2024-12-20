import React, { useRef ,useState ,useEffect,useContext} from 'react'
import { Link } from 'react-router-dom'
import { CaptainDetails } from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import {CaptainDataContext} from '../context/CaptainContext'
import axios from 'axios'
const CaptainHome = () => {
    const [ridePopUpPanel, setRidePopUpPanel] = useState(false)
    const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
    const [ ride, setRide] = useState(null)

    const ridePopUpPanelRef = useRef();
    const confirmRidePopUpPanelRef = useRef();

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(()=>{
        if(!captain) return

        socket.emit('join', {userId: captain._id,userType:'captain'})

        const updateLocation = () => {
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position) => {
                    const {latitude,longitude} = position.coords
                    
                    socket.emit('update-location-captain', {userId: captain._id,location:{ltd:latitude,lng:longitude}})
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()
        // return()=> clearInterval(locationInterval)
    },[])

    async function confirmRide(){
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            captainId: captain._id,
            rideId: ride._id},
            {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }  
            })
    }

    socket.on('newRide',(data)=>{
        setRide(data)
        setRidePopUpPanel(true)
    })

    useGSAP(function(){
        if(ridePopUpPanel){
            gsap.to(ridePopUpPanelRef.current, {
                transform:'translateY(0)'
            })
        }
        else{
            gsap.to(ridePopUpPanelRef.current, {
                transform:'translateY(100%)'
            })
        }
    },[ridePopUpPanel])

    useGSAP(function(){
        if(confirmRidePopUpPanel){
            gsap.to(confirmRidePopUpPanelRef.current, {
                transform:'translateY(0)'
            })
        }
        else{
            gsap.to(confirmRidePopUpPanelRef.current, {
                transform:'translateY(100%)'
            })
        }
    },[confirmRidePopUpPanel])

    return (
    <div className='h-screen'>
        <div className='fixed p-3 top-0 flex items-center justify-between w-screen '>
            <img className='w-16' src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'></img>
            <Link to='/home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i class="text-lg font-medium ri-logout-box-r-line"></i>
            </Link>
        </div>
        <div className='h-3/5'>
            <img className='object-cover w-full h-full' src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" alt="" />
            </div>
        <div className='h-2/5 p-6'>
            <CaptainDetails />
        </div>
        <div ref={ridePopUpPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
            <RidePopUp ride={ride} confirmRide={confirmRide} setRidePopUpPanel={setRidePopUpPanel} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}/>
        </div>
        <div ref={confirmRidePopUpPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
            <ConfirmRidePopUp ride={ride} setRidePopUpPanel={setRidePopUpPanel} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}/>
        </div>
    </div>
    )
}

export default CaptainHome