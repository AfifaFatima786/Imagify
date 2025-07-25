import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { createContext } from "react";

export const AppContext=createContext()

const AppContextProvider=(props)=>{
    const[user,setUser]=useState(null);
    const[showLogin,setShowLogin]=useState(false);
    const[token,setToken]=useState(localStorage.getItem('token'))

    const [credit,setCredit]=useState(false)

    const backendUrl=import.meta.env.VITE_BACKEND_URL;

    const loadCreditsData=async()=>{
        try{
            const {data}=axios.get(`${backendUrl}/api/user/credits`, {
            withCredentials: true
});


            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.message)

        }
    }
                       

    const value={
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit

    }


    return (
        <AppContext.Provider value={value}>
            {props.children}

        </AppContext.Provider>
    )
}
export default AppContextProvider