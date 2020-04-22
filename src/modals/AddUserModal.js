import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { Button, Form, FormInput } from "shards-react";
import apis from '../apis'
import util from '../util';

const dialogStyle = {
    maxWidth: 500,
    width: 500
};

export default function AddUserModal({
    type = 'admin',
    onCloseRequest,
    onUserAdded
}) {
    useEffect(() => {
        return () => { };
    }, []);
    const [waiting, setWaiting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async () => {
        if (!email) {
            alert('email을 입력하세요')
            return;
        }
        if (!password) {
            alert('password를 입력하세요')
            return;
        }
        setWaiting(true)
        try {
            const response = await apis.adminController.addUser(type, email, password)
            if (onUserAdded) {
                const newUser = response.data
                if (!newUser.authorities) {
                    newUser.authorities = []
                }
                if (!newUser.boardAuthorizations) {
                    newUser.boardAuthorizations = []
                }
                onUserAdded(response.data)
            }
            if (onCloseRequest) {
                onCloseRequest()
            }
        } catch (error) {
            alert(util.getErrorMessage(error) || '유저 추가에 실패했습니다.');
        }
        setWaiting(false)
    }

    return (
        <Modal
            onCloseRequest={onCloseRequest}
            dialogStyle={dialogStyle}
            footerActions={["submit", "close"]}
            submitEnabled={!waiting}
            onSubmitRequest={onSubmit}
        >
            <b>Email</b>
            <FormInput
                className="mb-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <b>Password</b>
            <FormInput
                type="password"
                className="mb-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
        </Modal >
    )
}