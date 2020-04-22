import React, { useState, useEffect } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    FormInput,
    Button,
} from "shards-react";
import update from 'immutability-helper';
import apis from '../apis';
import util from '../util';

export default function PasswordReset({ user }) {
    const [newPassword, setNewPassword] = useState('')
    useEffect(() => {
        setNewPassword('')
        return () => { };
    }, [user])

    const onSubmit = () => {
        if (!newPassword) {
            alert('패스워드를 입력하셔야 합니다');
        }
        if (window.confirm(`${user.email} 패스워드를 초기화하시겠습니까?`)) {
            apis.adminController.changePassword(user.id, newPassword).then(response => {
                alert('비밀번호 변경에 성공했습니다.')
            }).catch(error => {
                alert(error ?.response ?.data ?.message || '비밀번호 변경에 성공했습니다.')
            })
        }
    }

    return (
        <Card small className="mb-4">
            <CardHeader className="border-bottom">
                <b>비밀번호 초기화</b>
            </CardHeader>
            <CardBody>
                <label>새 비밀번호</label>
                <form autoComplete="off">
                    <FormInput
                        type="password"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value) }}
                    />
                </form>
                <Button theme="primary" style={{ width: '100%', marginTop: 6 }} onClick={onSubmit}>변경</Button>
            </CardBody>
        </Card>
    )
}