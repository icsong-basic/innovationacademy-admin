import React, { useState, useEffect } from 'react'
import {
    Container,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Form,
    FormInput,
    FormSelect,
    Button
} from "shards-react";
import PageTitle from '../shards-dashboard-template/components/common/PageTitle';
import apis from '../apis'
import constants from '../constants';
import update from 'immutability-helper';
import { withRouter } from 'react-router-dom';
import BoardAuthorityManager from '../components/BoardAuthorityManager';
import AddUserModal from '../modals/AddUserModal';
import PasswordReset from '../components/PasswordReset';

export default withRouter(function ManageUsers({ history }) {
    const [searchEmail, setSearchEmail] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [addingRole, setAddingRole] = useState('')
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    useEffect(() => {
        setSearchTimeout(window.setTimeout(() => {
            setSelectedUser(null)
            apis.adminController.searchUser(searchEmail, 'admin').then(response => {
                setSearchResult(response.data)
                setSearchTimeout(null)
            }).catch(error => {
                setSearchResult([]);
                setSearchTimeout(null)
            })
        }, 500))

        return () => {
            if (searchTimeout) {
                window.clearTimeout(searchTimeout)
            }
        };
    }, [searchEmail])

    const addRole = () => {
        if (!selectedUser) {
            alert('유저를 선택하세요.')
            return;
        }
        if (!addingRole) {
            alert('추가할 권한을 선택해 주세요.');
            return;
        }
        if (selectedUser.authorities && selectedUser.authorities.findIndex(item => item.name === addingRole) >= 0) {
            alert('이미 추가된 권한입니다.');
            return;
        }

        apis.adminController.addRole(selectedUser.id, addingRole).then(response => {
            const newUser = response.data;
            const prevIndex = searchResult.findIndex(item => item.id === newUser.id);
            if (prevIndex >= 0) {
                setSearchResult(update(searchResult, { $splice: [[prevIndex, 1, newUser]] }))
            }
            setSelectedUser(newUser);
        }).catch(error => {
            alert(error ?.response ?.data ?.message || '권한 추가에 실패했습니다.');
        })
    }
    const resetRoles = () => {
        apis.adminController.resetRoles(selectedUser.id).then(response => {
            const newUser = response.data;
            const prevIndex = searchResult.findIndex(item => item.id === newUser.id);
            if (prevIndex >= 0) {
                setSearchResult(update(searchResult, { $splice: [[prevIndex, 1, newUser]] }))
            }
            setSelectedUser(newUser);
        }).catch(error => {
            alert(error ?.response ?.data ?.message || '권한 초기화에 실패했습니다.');
        })
    }

    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="Users" md="12" className="ml-sm-auto mr-sm-auto" />
            </Row>
            <Row>
                <Col md={selectedUser ? "5" : "12"}>
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <b>유저 검색</b>
                            <Button className="float-right" onClick={() => { setShowAddUserModal(true) }}>유저 추가</Button>
                        </CardHeader>
                        <CardBody>
                            <form autoComplete="off">
                                <FormInput name="off" className="mb-2" placeholder="email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} />
                            </form>
                            <table className="table mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th scope="col" className="border-0">#</th>
                                        <th scope="col" className="border-0">Email</th>
                                        <th scope="col" className="border-0">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResult && searchResult.length > 0 ? searchResult.map((item, key) => {
                                        return <tr
                                            key={key}
                                            style={{ cursor: 'pointer', backgroundColor: selectedUser && selectedUser.id === item.id ? 'rgba(0,0,255,0.1)' : undefined }}
                                            onClick={() => { setSelectedUser(item) }}>
                                            <td>{item.id}</td>
                                            <td>{item.email}</td>
                                            <td>{item.authorities ?
                                                item.authorities.map(item => constants.rolesKor[item.name]).join(', ') : ''
                                            }</td>
                                        </tr>
                                    }) : <tr><td colSpan={3}>검색 결과가 없습니다.</td></tr>}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Col>
                {
                    selectedUser ? <Col md="7">
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <b>권한 설정</b>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Row form>
                                        <Col md="12" className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <FormInput
                                                id="email"
                                                type="email"
                                                placeholder="Email"
                                                value={selectedUser.email}
                                                disabled
                                            />
                                        </Col>
                                    </Row>
                                    <Row form>
                                        <Col md="12" className="form-group">
                                            <label>등록된 권한</label>
                                            <table className="table">
                                                <tbody>
                                                    {
                                                        selectedUser.authorities && selectedUser.authorities.length > 0 ? selectedUser.authorities.map((item, key) => <tr key={key}>
                                                            <td>{constants.rolesKor[item.name]}</td>
                                                        </tr>) : <tr><td>등록된 권한이 없습니다.</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                            <FormSelect className="mb-1" value={addingRole} onChange={e => setAddingRole(e.target.value)}>
                                                <option disabled value="">추가할 권한</option>
                                                {
                                                    [
                                                        constants.roles.ROLE_ADMIN,
                                                        constants.roles.ROLE_BOARD_MANAGER,
                                                        constants.roles.ROLE_FAQ_UPDATER,
                                                        constants.roles.ROLE_STUDENT_MANAGER
                                                    ].map((item, key) => <option key={key} value={item}>{constants.rolesKor[item]}</option>)
                                                }
                                            </FormSelect>
                                            <Button theme="primary" style={fullWidthBtn} onClick={addRole}>권한 추가</Button>
                                            <Button theme="danger" style={fullWidthBtn} onClick={resetRoles}>권한 초기화</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                        {
                            !selectedUser.authorities.find(auth => auth.name === constants.roles.ROLE_ADMIN)
                                && selectedUser.authorities.find(auth => auth.name === constants.roles.ROLE_BOARD_MANAGER) ?
                                <BoardAuthorityManager user={selectedUser} onUserUpdate={() => {
                                    apis.adminController.searchUser(searchEmail, 'admin').then(response => {
                                        setSearchResult(response.data)
                                    })
                                }} /> : undefined
                        }
                        {selectedUser ? <PasswordReset user={selectedUser} /> : undefined}
                    </Col> : undefined
                }
            </Row>
            {
                showAddUserModal ?
                    <AddUserModal
                        onCloseRequest={() => { setShowAddUserModal(false) }}
                        onUserAdded={(user) => {
                            setSearchResult(update(searchResult, { $push: [user] }))
                        }}
                    /> :
                    undefined
            }
        </Container >
    )
})

const fullWidthBtn = { width: '100%', marginBottom: 5 }
