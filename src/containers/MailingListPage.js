import React, { useState } from 'react'
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
import { withRouter } from 'react-router-dom';
import util from '../util';

export default withRouter(function MailingListPage({ history }) {
    const [waiting, setWaiting] = useState(false)
    const [mailingList, setMailingList] = useState(null)
    const fetchData = () => {
        setWaiting(true);
        apis.adminController.getMailingList().then(response => {
            setMailingList(response.data)
            setWaiting(false);
        }).catch(error => {
            alert(util.getErrorMessage(error) || "메일링 리스트를 가져올 수 없습니다.")
            setWaiting(false);
        })
    }
    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="Mailing List" md="12" className="ml-sm-auto mr-sm-auto" />
            </Row>
            <Row>
                <Col md="12">
                    <Card small className="mb-4">
                        <CardBody>
                            <div className="mb-2">
                                <Button className="mr-1" onClick={fetchData}>조회</Button>
                                <a target="_blank" rel="noopener noreferrer" download href={`/api/v1/admin/mailing.csv`}><Button>메일링 리스트 CSV 다운로드</Button></a>
                            </div>

                            {
                                waiting ?
                                    <p>Waiting</p> :
                                    mailingList ?
                                        <div>
                                            <p className="mb-2">조회 건수: {mailingList.length}</p>
                                            {
                                                mailingList.map((item, key) => {
                                                    return <p className="mb-1" key={key}>{item.email}</p>
                                                })
                                            }
                                        </div>
                                        : undefined
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container >
    )
})
