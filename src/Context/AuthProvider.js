import React, { useEffect, createContext, useState } from 'react'
import { app } from './../firebase/config';
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {  useNavigate} from 'react-router-dom'
import { Spin } from 'antd';


const auth = getAuth();
export const AuthContext = createContext();

export default function AuthProvider({children}) {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const unSubscribed = onAuthStateChanged(auth, user => {
            if (user) {
                const {displayName, email, uid, photoURL} = user;
                setUser({displayName, email, uid, photoURL});
                setIsLoading(false);
                navigate('/')
            } else {
                setIsLoading(false);
                navigate('/login')
            }
        })

        //clean func
      return () => {
        unSubscribed();
      }
    }, [navigate])
    


    return (
        <AuthContext.Provider value={{user}}>
            {isLoading ? <Spin/> : children}
        </AuthContext.Provider>
    )
}
