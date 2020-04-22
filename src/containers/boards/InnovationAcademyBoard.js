import React, { useState, useEffect } from 'react'
import { Row, Container, Button, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from '../../shards-dashboard-template/components/common/PageTitle';
import apis from '../../apis';
import ReactPaginate from 'react-paginate';
import InnovationAcademyEditor from '../../modals/InnovationAcademyEditor';
import LabelEditorModal from '../../modals/LabelEditorModal';
import LoginStatus from '../../data/singleton/LoginStatus';
import constants from '../../constants';

const boardIds = [3, 4]
export default function InnovationAcademyBoard() {
    // load boards when mounted
    const [boards, setBoards] = useState([]);
    const [labels, setLabels] = useState([]);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [selectedLabelGroup, setSelectedLabelGroup] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState([]);

    const [openPostModal, setOpenPostModal] = useState(false);
    const [openLabelEditor, setOpenLabelEditor] = useState(false);
    const [selectedPost, setSelectedPost] = useState(false);

    useEffect(() => {
        fetchDatas()
        return () => { };
    }, []);

    useEffect(() => {
        setPage(0)
        setTotalPages(0)
        fetchPosts(selectedBoardId, selectedLabelGroup, 0);
        return () => { }
    }, [selectedBoardId, selectedLabelGroup])

    const fetchDatas = async () => {
        let boardList;
        try {
            boardList = (await apis.boardController.getList()).data.filter(item => (boardIds.findIndex(id => id === item.id)) >= 0);
        } catch (error) {
            console.error(error)
            alert('게시판 리스트를 불러올 수 없습니다.');
        }

        let labelList;
        try {
            labelList = (await apis.boardController.getLabels(boardIds)).data.filter(item => (boardIds.findIndex(id => id === item.board.id) >= 0));
            labelList = labelList.reduce((prevV, currentItem) => {
                const item = prevV.find(item => item.name === currentItem.name)
                if (!item) {
                    prevV.push({ name: currentItem.name, labels: [{ labelId: currentItem.id, boardId: currentItem.board.id }] })
                } else {
                    item.labels.push({ labelId: currentItem.id, boardId: currentItem.board.id })
                }
                return prevV;
            }, [])
        } catch (error) {
            console.error(error)
            alert('라벨 리스트를 불러올 수 없습니다.');
        }
        setBoards(boardList)
        setLabels(labelList)
    }

    const fetchPosts = async (boardId, labelGroup, page) => {
        let request;
        setPage(page)
        if (boardId) {
            if (labelGroup) {
                const label = labelGroup.labels.find(item => item.boardId === boardId);
                if (label) {
                    request = apis.boardController.getLabelPosts([label.labelId], page);
                }
            } else {
                request = apis.boardController.getPosts(boardId, page);
            }
        } else {
            if (labelGroup) {
                request = apis.boardController.getLabelPosts(labelGroup.labels.map(label => label.labelId), page);
            } else {
                request = apis.boardController.getPostsFromMultipleBoards(boardIds, page);
            }
        }
        if (!request) {
            setTotalPages(0)
        } else {
            let data;
            try {
                data = (await request).data;
                setTotalPages(data.totalPages)
                setPosts(data.content)
            } catch (error) {
                console.error(error)
                alert(error ?.response ?.data ?.message || "게시글을 불러올 수 없습니다.")
            }
        }
    }

    return (
        <Container fluid className="main-content-container px-4 innovationacademy-board-page">
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Innovation Academy Board"
                    className="text-sm-left"
                />
            </Row>
            <Card>
                <CardHeader>
                    <div className="category">
                        <label>카테고리</label>
                        <span className={selectedBoardId === null ? "on" : ""} onClick={() => (setSelectedBoardId(null))}>전체</span>
                        {boards.map((item, key) => <span className={selectedBoardId === item.id ? "on" : ""} onClick={() => (setSelectedBoardId(item.id))} key={key}>{item.name}</span>)}
                    </div>
                    <div className="category">
                        <label>말머리</label>
                        <span className={selectedLabelGroup === null ? "on" : ""} onClick={() => (setSelectedLabelGroup(null))}>전체</span>
                        {
                            labels
                                .map((item, key) => {
                                    return <span className={selectedLabelGroup && selectedLabelGroup.name === item.name ? "on" : ""}
                                        onClick={() => (setSelectedLabelGroup(item))} key={key}>
                                        {item.name}
                                    </span>
                                })
                        }
                    </div>

                    {
                        LoginStatus.hasBoardAuthority(boardIds[0], constants.boardAuthorities.create) ||
                            LoginStatus.hasBoardAuthority(boardIds[1], constants.boardAuthorities.create) ?
                            <Button className="float-right" onClick={() => (setOpenPostModal(true))}>작성</Button>
                            : undefined
                    }
                    {
                        LoginStatus.hasBoardAuthority(boardIds[0], constants.boardAuthorities.labelCreate) ||
                            LoginStatus.hasBoardAuthority(boardIds[0], constants.boardAuthorities.labelDelete) ||
                            LoginStatus.hasBoardAuthority(boardIds[0], constants.boardAuthorities.labelModify) ||
                            LoginStatus.hasBoardAuthority(boardIds[1], constants.boardAuthorities.labelCreate) ||
                            LoginStatus.hasBoardAuthority(boardIds[1], constants.boardAuthorities.labelDelete) ||
                            LoginStatus.hasBoardAuthority(boardIds[1], constants.boardAuthorities.labelModify) ?
                            <Button className="float-right" style={{ marginRight: 4 }} onClick={() => (setOpenLabelEditor(true))}>말머리 수정</Button>
                            : undefined
                    }
                </CardHeader>
                <CardBody>
                    <table className="table mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th scope="col" className="border-0" style={{ width: 80 }}>#</th>
                                <th scope="col" className="border-0">제목</th>
                                <th scope="col" className="border-0" style={{ width: 150 }}>작성자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                posts ?.map((item, key) => {
                                    return <tr
                                        key={key}
                                        style={{ cursor: 'pointer' }}
                                        onClick={async () => {
                                            try {
                                                const post = (await apis.boardController.getPost(item.boardId, item.id)).data
                                                setSelectedPost(post);
                                            } catch (error) {
                                                alert('게시물 불러오는데 실패했습니다.');
                                            }
                                        }}>
                                        <td>{item.id}</td>
                                        <td>{item.title}</td>
                                        {<td>{item.author}</td>}
                                    </tr>
                                })
                    }
                        </tbody>
                    </table>
                    <ReactPaginate
                        containerClassName="paginate"
                        previousLabel="Prev"
                        nextLabel="Next"
                        pageCount={totalPages}
                        forcePage={page}
                        initialPage={page}
                        onPageChange={(e) => {
                            setPage(e.selected);
                            fetchPosts(selectedBoardId, selectedLabelGroup, e.selected);
                        }}
                    />
                </CardBody>
            </Card>
            {
                openLabelEditor && <LabelEditorModal
                    onSubmitSuccess={() => {
                        fetchPosts(selectedBoardId, selectedLabelGroup, page);
                        setOpenPostModal(false)
                    }}
                    mode="write"
                    onCloseRequest={() => {
                        fetchDatas()
                        setOpenLabelEditor(false)
                    }}
                />
            }
            {
                openPostModal && <InnovationAcademyEditor
                    onSubmitSuccess={() => {
                        fetchPosts(selectedBoardId, selectedLabelGroup, page);
                        setOpenPostModal(false)
                    }}
                    mode="write"
                    onCloseRequest={() => setOpenPostModal(false)}
                />
            }
            {
                selectedPost && <InnovationAcademyEditor
                    onSubmitSuccess={() => {
                        fetchPosts(selectedBoardId, selectedLabelGroup, page);
                        setSelectedPost(null)
                    }}
                    mode="edit"
                    onCloseRequest={() => setSelectedPost(null)} editTarget={selectedPost}
                />
            }
        </Container >
    )
}

export function getBoardName(name) {
    return name;
}