import React from 'react'
import {
    Container,
    Row,
    Col
} from "shards-react";
import PageTitle from '../shards-dashboard-template/components/common/PageTitle';

export default function MainPage() {
    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="Main" md="12" className="ml-sm-auto mr-sm-auto" />
            </Row>
            <Row>
                <Col md="12">
                    <h6>Innovation Academy, 42 Seoul 관리자 페이지 입니다.</h6>
                </Col>
            </Row>
        </Container>
    )
}
