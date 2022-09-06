import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Avatar, Tooltip, Form, Input, Alert } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { Message } from './Message';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument } from '../../firebase/service';
import { useFireStore } from '../../hooks/useFireStore';
import { formatRelative } from 'date-fns';

//Wrapper full screen
const WrapperStyled = styled.div`
  height:100vh;
`

// header
const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  border-bottom: 1px solid rgb(230, 230, 230);
  align-items: center;
  padding: 0 16px;

  .header {
    &__info{
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__title{
      margin: 0;
      front-weight: bold;
    }
    &__description{
      font-size: 12px
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`
// Content
const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 12px;
`
const MessageStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`
const FormStyled = styled(Form)`  
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgb(230, 230, 230);
  padding: 2px 2px 2px 0;
  border-radius: 4px;

  .ant-form-item{
    flex: 1;
    margin-bottom: 0;
  }
`

export const ChatWindow = () => {

  const { selectRoom, members, setIsInviteMemberVisible } = useContext(AppContext);
  const { user: { uid, photoURL, displayName } } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');

  // const selectRoom = useMemo(() => rooms.find(
  //   room => room.id === selectRoomId
  // ), [rooms, selectRoomId]);
  //console.log(members);
  const [form] = Form.useForm();

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleOnSubmit = () => {
    addDocument('messages', {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectRoom.id,
      displayName
    })
    form.resetFields(['message']);
  }

  const condition = useMemo(() => ({
    fieldName: 'roomId',
    operator: '==',
    compareValue: selectRoom.id
  }), [selectRoom.id])

  const messages = useFireStore("messages", condition)

  const formatDate = seconds => {
    let formattedDate = '';
    if(seconds){
      formattedDate = formatRelative(new Date(seconds * 1000), new Date());

      formattedDate = formattedDate?.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
  }
  return (
    <WrapperStyled>
      {
        selectRoom.id ? (<>
          <HeaderStyled>
            <div className='header__info'>
              <p className='header__title'>
                {selectRoom.name}
              </p>
              <span className='header__description'>
                {selectRoom.descriptions || selectRoom.description}
              </span>
            </div>

            <div>
              <ButtonGroupStyled>
                <Button
                  type='text'
                  icon={<UserAddOutlined />}
                  onClick={() => setIsInviteMemberVisible(true)}
                >
                  Add member
                </Button>

                <Avatar.Group maxCount={2} size='small'>
                  {members.map(member => (
                   
                    <Tooltip title={member.displayName} key={member.id}>
                      <Avatar src={member.photoURL}>
                        {member.photoURL ? '' : member.displayName?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </ButtonGroupStyled>
            </div>
          </HeaderStyled>

          {/* Message */}

          <ContentStyled>
            <MessageStyled>
              {
                messages.map(message => (
                  <Message 
                  key={message.id}
                  text={message.text} 
                  photoURL={message.photoURL} 
                  createAt={formatDate(message.createAt?.seconds)} 
                  displayName={message.displayName} />
                ))
              }
            </MessageStyled>
            <FormStyled form={form}>
              <Form.Item name='message'>
                <Input
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder='Enter your message...'
                  bordered={false}
                  autoComplete='off'
                />
              </Form.Item>
              <Button type='primary' onClick={handleOnSubmit}>
                Sent
              </Button>
            </FormStyled>
          </ContentStyled>
        </>) : <Alert message="Please choose a room" type='info' showIcon style={{ margin: 5 }} closable />
      }
    </WrapperStyled>
  )
}
