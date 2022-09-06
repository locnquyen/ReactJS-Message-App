import React, { useContext } from 'react'
import { Collapse, Typography, Button } from 'antd'
import styled from 'styled-components'
import { PlusSquareOutlined } from '@ant-design/icons'
import { AppContext } from '../../Context/AppProvider'


const PanelStyled = styled(Collapse.Panel)`
    &&& {
        .ant-collapse-header,
        p {
            color: white;
        }
        .ant-collapse-content-box{
            padding: 0 40px
        }
        .add-room{
            color:white;
            padding: 0;
        }
    }

`
const LinkStyled = styled(Typography.Link)`
    display: block;
    margin-bottom: 5px;
`

export const RoomList = () => {
    // const { user: { uid } } = useContext(AuthContext)
    // /**
    //  * {
    //  *   name: "room name",
    //  *   description: "mo ta",
    //  *   member: [uid1, ud2,...]
    //  * }
    //  */
    // const roomsCondition = useMemo(() => ({
    //     fieldName: 'member',
    //     operator: 'array-contains',
    //     compareValue: uid
    // }), [uid])

    // const rooms = useFireStore("rooms", roomsCondition);

    const { rooms, setIsAddRoomVisible, setSelectRoomId } = useContext(AppContext)
    console.log(rooms)
    const handleAddRoom = () => {
        setIsAddRoomVisible(true);
    }

    return (
        <Collapse ghost defaultActiveKey={['1']}>
            <PanelStyled header='List of rooms' key={1}>
                {
                    rooms.map(room => (
                        <LinkStyled 
                            key={room.id} 
                            onClick={()=>setSelectRoomId(room.id)}
                        > 
                            {room.name}
                        </LinkStyled>
                    ))
                }

                <Button ghost
                    className='add-room'
                    type='text'
                    icon={<PlusSquareOutlined />}
                    onClick={handleAddRoom}
                >
                    Add Room
                </Button>
            </PanelStyled>
        </Collapse>
    )
}
