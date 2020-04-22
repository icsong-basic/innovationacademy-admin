// @flow

import React, { useEffect, useState, useCallback } from 'react'
import type { Board } from '../../apiModelTypes'
import type { Language } from '../../apiModelTypesExtra'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  FormInput,
  FormGroup,
  FormCheckbox
} from "shards-react";
import apis from '../../apis';
import ReactPaginate from 'react-paginate';
import BoardPostModal from '../../modals/BoardPostModal';
import util from '../../util';

type Type = {
  board: Board,
  hasThumbnail: boolean,
  languageCode: Language
}

export default function ThumbnailBoard({ board, hasThumbnail = false, languageCode }: Type) {
  const [checkedPosts, setCheckedPosts] = useState([]);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const loadPage = useCallback(
    (page) => {
      setWaiting(true);
      apis.boardController.getPosts(board.id, page, pageSize, languageCode).then(response => {
        setPosts(response.data);
        setTotalPage(response.data.totalPages);
        setWaiting(false);
        setCheckedPosts([]);
      }).catch(error => {
        console.error(error);
        alert(`${page + 1}페이지 불러오기에 실패했습니다.\n${util.getErrorMessage(error)}`);
        setWaiting(false);
        setCheckedPosts([]);
      });
    },
    [setWaiting, setPosts, setTotalPage, setPosts],
  );

  useEffect(() => {
    loadPage(page);
    return undefined;
  }, [page]);

  const onCheckboxClick = useCallback(() => {

  }, [setCheckedPosts, checkedPosts])

  const loadSelectedPost = useCallback(async (post) => {
    try {
      const result = await apis.boardController.getPost(board.id, post.id);
      setSelectedPost(result.data);
    } catch (error) {
      alert(util.getErrorMessage(error));
    }
  }, [setSelectedPost, board]);

  return (
    <Row className="default-board">
      <h4 className="display-block" style={{ width: '100%' }}>
        {board.name}
        <Button className="float-right" onClick={() => (setOpenPostModal(true))}>작성</Button>
      </h4>
      <table className="table mb-0">
        <thead className="bg-light">
          <tr>
            <th scope="col" className="border-0" style={{ width: 80 }}>#</th>
            {
              hasThumbnail && <th scope="col" className="border-0">썸네일</th>
            }
            <th scope="col" className="border-0">제목</th>
            <th scope="col" className="border-0" style={{ width: 150 }}>작성자</th>
            {/* <th scope="col" className="border-0" style={{ width: 150 }}>게시</th> */}
          </tr>
        </thead>
        <tbody>
          {
            posts ?.content ?.map((item, key) => {
              return <tr key={key} style={{ cursor: 'pointer' }} onClick={() => (loadSelectedPost(item))}>
                <td>{item.id}</td>
                {hasThumbnail && <td>{item.thumbnail}</td>}
                <td>{item.title}</td>
                <td>{item.author}</td>
                {/* <td>{item.publishedAt ? "Y" : "N"}</td> */}
              </tr>
            })
          }
        </tbody>
      </table>
      {waiting && <p style={loadingP}>Loading...</p>}
      <ReactPaginate
        containerClassName="paginate"
        previousLabel="Prev"
        nextLabel="Next"
        pageCount={totalPage}
        forcePage={page}
        initialPage={page}
        onPageChange={(e) => {
          setPage(e.selected);
        }}
      />
      {
        openPostModal &&
        <BoardPostModal
          mode="write"
          board={board}
          onCloseRequest={() => (setOpenPostModal(false))}
          onSubmitSuccess={() => {
            setOpenPostModal(false);
            if (page === 0) {
              loadPage(0);
            } else {
              setPage(0);
            }
          }}
          languageCode={languageCode}
        />
      }

      {
        selectedPost &&
        <BoardPostModal
          mode="edit"
          board={board}
          onCloseRequest={() => (setSelectedPost(null))}
          onSubmitSuccess={() => {
            setSelectedPost(null);
            loadPage(page);
          }}
          languageCode={languageCode}
          initialPostingInput={selectedPost}
        />
      }
    </Row>
  )
}

const loadingP = {
  display: 'block',
  width: '100%',
  textAlign: 'center',
  padding: '1em'
};

const pageSize = 15;