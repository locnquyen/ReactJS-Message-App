import { Form, Input, Modal } from 'antd'
import React, { useContext, useState } from 'react'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument } from '../../firebase/service';

export const AddRoomModal = () => {

    const {isAddRoomVisible, setIsAddRoomVisible} = useContext(AppContext);
    const {user :{uid}} = useContext(AuthContext);
    const [form] = Form.useForm();

    const handleOK = () => {
        //handle logic
        //add new room to fireStore
        console.log({form: form.getFieldValue()});
        addDocument("rooms",{...form.getFieldValue(),members: [uid]})
        //reset form
        form.resetFields();
        //close modal
        setIsAddRoomVisible(false);
    }

    const handleCancel = () => {
        //reset form
        form.resetFields();
        //close modal
        setIsAddRoomVisible(false)
    }

  return (
    <div>
        <Modal 
            title="Create room" 
            visible={isAddRoomVisible}
            onOk={handleOK}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Room Name" name="name">
                    <Input placeholder='Enter room name'/>
                </Form.Item>
                <Form.Item label="Description" name="descriptions">
                    <Input.TextArea placeholder='Enter room description'/>
                </Form.Item>
            </Form>
        </Modal>
    </div>
  )
}
