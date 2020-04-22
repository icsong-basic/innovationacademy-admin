import React, { useState, useEffect, useMemo } from 'react'
import {
    Row,
    Container,
    Card,
    CardHeader,
    CardBody,
    Nav, NavItem
} from "shards-react";
import { Switch, Route, Redirect } from 'react-router-dom';
import PageTitle from '../../shards-dashboard-template/components/common/PageTitle';
import NavLink from "../../components/NavLink";
import apis from '../../apis';
import DefaultBoard from './DefaultBoard';

export default function MultipleBoard({
    recommendedImage,
    pathName,
    boardIds,
    pageName,
    useInputContents = false,
    useInputSummary = true,
    useInputAuthor = true,
    useInputLink = true,
    useInputThumbnail = true
}) {
    const [boards, setBoards] = useState([]);

    // load boards when mounted
    useEffect(() => {
        apis.boardController.getList().then(response => {
            const boards = response.data.filter(board => boardIds.includes(board.id))
            setBoards(boards);
        }).catch(error => {
            console.error(error);
            alert('게시판 정보를 불러올 수 없습니다.');
        })
        return undefined;
    }, []);

    const memoizedSwitch = useMemo(() => {
        if (!boards || boards.length <= 0) {
            return null;
        }
        return <Switch>
            {
                boards.map((item, key) => (
                    <Route key={key} path={getBoardPath(item)} component={getBoardComponent(item)} />
                ))
            }
            <Redirect to={getBoardPath(boards[0])} />
        </Switch>
    }, [boards]);

    function getBoardPath(board) {
        return `${pathName}/${board.id}`
    }


    function getBoardComponent(board) {
        switch (board.name.toLowerCase()) {
            default:
                const recommendedImageProp = !recommendedImage ? '' :
                    (
                        typeof (recommendedImage) === 'string' ?
                            recommendedImage :
                            recommendedImage[board.id]
                    )
                return (props) => (<DefaultBoard
                    board={board}
                    useInputContents={useInputContents}
                    useInputSummary={useInputSummary}
                    useInputAuthor={useInputAuthor}
                    useInputLink={useInputLink}
                    useInputThumbnail={useInputThumbnail}
                    recommendedImage={recommendedImageProp || ''}
                    {...props}
                />)
        }
    }

    return (
        <Container fluid className="main-content-container px-4 image-upload-page">
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title={pageName}
                    className="text-sm-left"
                />
            </Row>
            {
                boards && boards.length > 0 ?
                    <Card>
                        <CardHeader className="position-relative">
                            <Nav tabs>
                                {
                                    boards.map((item, key) => (
                                        <NavItem key={key}>
                                            <NavLink to={getBoardPath(item)}>{item.name}</NavLink>
                                        </NavItem>
                                    ))
                                }
                            </Nav>
                            <Switch>
                                <Route path={pathName} component={null} />
                            </Switch>
                        </CardHeader>
                        <CardBody>
                            {memoizedSwitch}
                        </CardBody>
                    </Card> :
                    <p>Loading...</p>
            }
        </Container>
    )
}
