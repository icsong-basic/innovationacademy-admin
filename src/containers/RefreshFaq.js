import React, { useState, useEffect } from 'react'
import {
    Row,
    Container,
    Button,
    Card,
    CardBody
} from "shards-react";
import PageTitle from '../shards-dashboard-template/components/common/PageTitle';
import apis from '../apis';

export default function RefreshFaq() {
    const [response, setResponse] = useState(null)
    const [waiting, setWaiting] = useState(false)

    // load boards when mounted
    useEffect(() => {
    }, []);

    const onRefreshClick = () => {
        setWaiting(true);
        apis.refreshFaq().then(response => {
            alert('갱신에 성공했습니다.');
            setWaiting(false);
            setResponse(response.data);
        }).catch(error => {
            setWaiting(false);
            setResponse(null);
            if (error.response && error.response.data)
                alert(error.response.data.toString());
            else
                alert('FAQ 갱신에 실패했습니다.')
        })
    }

    return (
        <Container fluid className="main-content-container px-4 image-upload-page">
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="42 Seoul FAQ"
                    className="text-sm-left"
                />
            </Row>
            <Card>
                <CardBody>
                    <Button size="lg" disabled={waiting} className="mb-3 full" onClick={onRefreshClick}>갱신</Button>
                    {
                        response && response.qnas ?
                            response.qnas.map((qna, key) => {
                                return <div key={key}>
                                    <p>{qna.category ? `[${qna.category}]` : ""} {qna.q}</p>
                                    <ul>
                                        {qna.a ? (
                                            Array.isArray(qna.a) ?
                                                qna.a.map((item, key) => {
                                                    return <li key={key}>{item}</li>
                                                }) : qna.toString()
                                        ) : undefined}
                                    </ul>
                                </div>
                            }) : undefined
                    }
                </CardBody>
            </Card>
        </Container>
    )
}