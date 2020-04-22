import React, { useState, useEffect } from 'react'
import QuillEditor from '../components/QuillEditor'
import util from '../util';
import {
    Container,
    Card,
    CardBody,
    Row,
    Col,
    Button
} from "shards-react";
import PageTitle from '../shards-dashboard-template/components/common/PageTitle';
import apis from '../apis'

const boardId = 10;
export default function EssayAgreementPage() {
    const agreementId = util.isProduction() ? 31 : 57;
    const privacyPolicyId = util.isProduction() ? 32 : 58;

    const [waiting, setWaiting] = useState(true)
    const [agreement, setAgreement] = useState('')
    const [privacyPolicy, setPrivacyPolicy] = useState('')

    useEffect(() => {
        fetchData();
        return () => { };
    }, [])

    const fetchData = async () => {
        setWaiting(true)
        const errorMessages = [];
        for (let { id, setter, label } of [
            { id: agreementId, setter: setAgreement, label: '이용약관' },
            { id: privacyPolicyId, setter: setPrivacyPolicy, label: '개인정보처리방침' },
        ]) {
            try {
                const response = await apis.boardController.getPost(boardId, id)
                setter(response.data.contents);
            } catch (error) {
                errorMessages.push(`${label}을 불러올 수 없습니다.`)
            }
        }

        if (errorMessages.length > 0) {
            alert(errorMessages.join('\n'))
        } else {
            setWaiting(false)
        }
    }

    const onSaveClick = async () => {
        setWaiting(true)
        const errorMessages = [];
        for (let { id, setter, label, value } of [
            { id: agreementId, setter: setAgreement, label: '이용약관', value: agreement },
            { id: privacyPolicyId, setter: setPrivacyPolicy, label: '개인정보처리방침', value: privacyPolicy },
        ]) {
            try {
                const response = await apis.boardController.put(boardId, id, { title: label, contents: value })
                setter(response.data.contents);
            } catch (error) {
                errorMessages.push(`${label}을 저장할 수 없습니다.`)
            }
        }

        if (errorMessages.length > 0) {
            alert(errorMessages.join('\n'))
            setWaiting(false)
        } else {
            alert('저장 완료.')
            setWaiting(false)
        }
    }

    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="에세이 약관" md="12" className="ml-sm-auto mr-sm-auto" />
            </Row>
            <Row>
                <Col md="12">
                    <Card small className="mb-4">
                        <CardBody>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ marginRight: 10 }}>
                                    <p>이용약관</p>
                                    <QuillEditor value={agreement} onChange={(newVal) => (setAgreement(newVal))} />
                                </div>
                                <div>
                                    <p>개인정보처리방침</p>
                                    <QuillEditor value={privacyPolicy} onChange={(newVal) => (setPrivacyPolicy(newVal))} />
                                </div>
                            </div>
                            <Button theme="primary" style={{ width: '100%' }} onClick={onSaveClick} disabled={waiting}>저장</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container >
    )
}
