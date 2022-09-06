import React, { useContext, useEffect } from 'react'
import { Button, Avatar, Typography } from 'antd'
import styled from 'styled-components'
import { app, db } from './../../firebase/config'
import { signOut, getAuth } from 'firebase/auth';
import { collection, onSnapshot, doc } from "firebase/firestore";
import {AuthContext} from './../../Context/AuthProvider'

const auth = getAuth();

const WrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(82, 38, 83);

    .username{
        color: white;
        margin-left: 4px
    }
`

export const UserInfo = () => {

    useEffect(() => {

        // const unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
        //     const data = snap.docs.map( doc => ({
        //         ...doc.data(),
        //         id : doc.id
        //     }))
        //     console.log(data)
        //     return data;
        //   });
    }, []);

    const {user} = useContext(AuthContext);
    //console.log(user);

    return (
        <WrapperStyled>
            <div>
                <Avatar
                    src={user.photoURL}
                >
                    { user.photoURL? '' : user.displayName?.charAt(0)?.toUpperCase() }
                </Avatar>
                <Typography.Text className='username'>
                   {user.displayName}
                </Typography.Text>
            </div>
            <Button onClick={() => signOut(auth)} ghost className='add-room'>
                Log out
            </Button>

        </WrapperStyled>
    )
}
