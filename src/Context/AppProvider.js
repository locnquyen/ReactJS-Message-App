import React, {  createContext, useContext, useMemo, useState } from 'react'
import { AuthContext } from './AuthProvider';
import { useFireStore } from '../hooks/useFireStore';


export const AppContext = createContext();

export default function AppProvider({children}) {

    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);

    const [selectRoomId, setSelectRoomId] = useState('');
    
    const { user: { uid } } = useContext(AuthContext)
    /**
     * {
     *   name: "room name",
     *   description: "mo ta",
     *   member: [uid1, ud2,...]
     * }
     */
    const roomsCondition = useMemo(() => ({
        fieldName: 'members',
        operator: 'array-contains',
        compareValue: uid
    }), [uid])

    //name conditions
    const rooms = useFireStore("rooms", roomsCondition);

    //add user
    const selectRoom = useMemo(() => rooms.find(
        room => room.id === selectRoomId
      ) || {}, [rooms, selectRoomId]);
   
    const usersCondition = useMemo(()=>({
        fieldName: 'uid',
        operator: 'in',
        compareValue: selectRoom.members
    }),[selectRoom.members])

    const members = useFireStore("users", usersCondition);
    return (
        <AppContext.Provider 
            value={
                {
                    rooms, 
                    isAddRoomVisible, 
                    setIsAddRoomVisible, 
                    selectRoomId, 
                    setSelectRoomId, 
                    selectRoom,
                    members,
                    isInviteMemberVisible, 
                    setIsInviteMemberVisible
                }
            }
        >
            {children}
        </AppContext.Provider>
    )
}
