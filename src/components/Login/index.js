import React from 'react'
import { Row, Col, Typography, Button } from 'antd'
import { app } from './../../firebase/config';
import { getAuth, signInWithPopup, FacebookAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { addDocument, generateKeywords } from '../../firebase/service';

const { Title } = Typography

const fbProvider = new FacebookAuthProvider();
const auth = getAuth();

export default function Login() {

    const handleFbLogin = () => {
        signInWithPopup(auth, fbProvider)
            .then(async result => {
                const user = result.user;
                console.log(user)
                const additionalUserInfo = getAdditionalUserInfo(result);
                console.log(additionalUserInfo);
                if(additionalUserInfo?.isNewUser){
                    try {
                       addDocument('users', {
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            uid: user.uid,
                            providerId : additionalUserInfo.providerId,
                            keywords: generateKeywords(user.displayName)
                       })
                    } catch (error) {
                        console.error('Error adding document:', error)
                    }
                }
            })
    }
    return (
        <div>
            <Row justify='center' style={{ heigh: 800 }}>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={1}>Realtime Chat</Title>
                    <Button style={{ width: '100%', marginBottom: 5 }}>
                        Login with Google
                    </Button>
                    <Button
                        style={{ width: '100%' }}
                        onClick={handleFbLogin}
                    >
                        Login with Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    )
}
