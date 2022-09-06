import React, { useContext, useMemo, useState } from 'react'
import { AppContext } from '../../Context/AppProvider';
import { Avatar, Form, Input, Modal, Select, Spin } from 'antd';
import { debounce } from 'lodash'
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { async } from '@firebase/util';

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
  //

  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);


  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, props.currentMembers).then(newOptions => {
        setOptions(newOptions);
        setFetching(true);
      })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [debounceTimeout, fetchOptions])
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      {...props}
    >
      {
        //[{label:, value, photoURL}]
        options?
        options.map(option => (
          <Select.Option key={option.value} value={option.value} type={option.label}>
            <Avatar size='small' src={option.photoURL}>
              {option.photoURL ? '' : option.label?.charAt(0)?.toUpperCase()}
            </Avatar>
            {`${option.label}`}
          </Select.Option>
        )) : ''
      }
    </Select>
  )
}

export const InviteMemberModal = () => {
  const { isInviteMemberVisible, setIsInviteMemberVisible, selectRoomId,selectRoom } = useContext(AppContext);
  const [value, setValue] = useState([]);

  const [form] = Form.useForm();

  const handleOK = () => {
    //handle logic
    //update member in current room
    const roomRef = doc(db,"rooms",selectRoomId);
    console.log(roomRef)
    // roomRef.update({
    //   members: [...selectRoom.members, ...value.map(val => val.value)]
    // })
    updateDoc(roomRef,{
        members: [...selectRoom.members, ...value.map(val => val.value)]
      })
    //reset form
    form.resetFields();
    //close modal
    setIsInviteMemberVisible(false);
  }

  const handleCancel = () => {
    //reset form

    //close modal
    setIsInviteMemberVisible(false);
  }
  async function fetchUerList(search, currentMembers) {
    const q = query(
      collection(db, "users"),
      where('keywords', 'array-contains', search),
      orderBy('displayName'), 
      limit(20),
    )
    const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
    return querySnapshot.docs.map(doc=> ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL
        })).filter(option=> !currentMembers.includes(option.value))
    //.get()
    // .then(snapshot => {
    //   return snapshot.docs.map(doc=> ({
    //     label: doc.data().displayName,
    //     value: doc.data().uid,
    //     photoURL: doc.data().photoURL
    //   }))
    // })
  }

  return (
    <div>
      <Modal
        title="Add member"
        visible={isInviteMemberVisible}
        onOk={handleOK}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode='multiple'
            label='members name'
            value={value}
            placeholder="Enter member name"
            fetchOptions={fetchUerList}
            onChange={newValue => setValue(newValue)}
            style={{ width: '100%' }}
            currentMembers={selectRoom.members}
          />
        </Form>
      </Modal>
    </div>
  )

}
