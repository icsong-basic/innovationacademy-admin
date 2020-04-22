import React, { useState } from 'react'
import type { Node } from 'react';
import {
    Row,
    Container,
    Button,
    Card,
    CardHeader,
    CardBody
} from "shards-react";
import PageTitle from '../shards-dashboard-template/components/common/PageTitle';
import ImageUploadModal from '../modals/ImageUploadModal';

export default () => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [uploadResult: Node | string, setUploadResult] = useState('');
    return (
        <Container fluid className="main-content-container px-4 image-upload-page">
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Image upload"
                    className="text-sm-left"
                />
            </Row>
            <Card small>
                <CardHeader className="border-bottom">
                    <Button size="sm" onClick={() => { setIsOpenDialog(true) }}>Open Upload dialog</Button>
                </CardHeader>
                <CardBody>
                    <h6 className="m-0">Results</h6>
                    <div className="results">{uploadResult}</div>
                </CardBody>
            </Card>
            {
                isOpenDialog &&
                <ImageUploadModal
                    onCloseRequest={() => { setIsOpenDialog(false) }}
                    onUploadSuccess={(urls) => {
                        setUploadResult(<table className="table mb-0">
                            <tbody>
                                {
                                    urls.map((url, key) => (
                                        <tr className="result">
                                            <td><img src={url} key={key} alt={key + 1} /></td>
                                            <td><a href={url} target="__blank" rel="noopener noreferrer">{url}</a></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>)
                        setIsOpenDialog(false)
                    }}
                    onUploadFailed={(error) => {
                        const data = error ?.response ?.data;
                        alert(`[${data ? data.error : 'Error'}]\n${data ? data.message : ''}`)
                    }}
                />
            }
        </Container>
    )
}
