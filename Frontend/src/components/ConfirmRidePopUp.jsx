import axios from 'axios';
import React ,{useState}from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ConfirmRidePopUp = ({setRidePopUpPanel,setConfirmRidePopUpPanel,ride}) => {
    const [otp, setOtp] = useState('')
    const navigate = useNavigate();

    const submitHandler = async(e) => {
        e.preventDefault()
        setOtp(Number(otp))
        console.log(ride)
        try{
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                    rideId:ride._id,
                    otp
                },{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`                    
                }
            })

            if(response.status === 200){
                setConfirmRidePopUpPanel(false);
                setRidePopUpPanel(false);
                navigate('/captain-riding',{state:{ride:ride}})
            }
            else{
                console.log(response)
            }

        }catch (error){
            console.log(error)
        }
        
    }

    return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                setConfirmRidePopUpPanel(false);
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to start</h3>
        <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
            <div className='flex items-center gap-3 justify-start'> 
                <img className='h-10 w-10 rounded-full object-cover' src="https://i.pinimg.com/originals/be/a3/49/bea3491915571d34a026753f4a872000.jpg" alt="" />
                <h2 className='text-lg font-medium'>{ride?.user.fullname.firstname + ' ' + ride?.user.fullname.lastname}</h2>
            </div>
            <h5 className='text-lg font-semibold'>2.2 KM</h5>
        </div>
        <div className='flex gap-2 justify-between items-center flex-col'>
            <div className='w-full mt-5'>
                {/* Pickup Location */}
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="text-lg ri-map-pin-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium'>{ride?.pickup.split(',')[0]}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{ride?.pickup}</p>
                    </div>
                </div>
                {/* Destination address */}
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="ri-rectangle-fill"></i>
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
            
            <div className='mt-6'>
                <form onSubmit={(e)=>{submitHandler(e)}}>
                    <input type="text" placeholder='Enter OTP' className='font-mono bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3' value={otp} onChange={(e)=>{setOtp(e.target.value)}}></input>
                    <button type='submit' className='flex justify-center w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Start Ride</button>
                    <button onClick={()=>{setConfirmRidePopUpPanel(false); setRidePopUpPanel(false)}} className='w-full mt-1 bg-red-600 text-white font-semibold p-2 rounded-lg'>Cancel</button>
                </form>
            </div>
        </div>
    </div> 
  )
}

export default ConfirmRidePopUp