// @flow

import React, { useEffect, useState, useCallback } from 'react'
import type { Board } from '../../apiModelTypes'
import type { Language } from '../../apiModelTypesExtra'
import {
  Row,
  Button
} from "shards-react";
import apis from '../../apis';
import ReactPaginate from 'react-paginate';
import BoardPostModal from '../../modals/BoardPostModal';
import util from '../../util';
import LoginStatus from '../../data/singleton/LoginStatus'
import constants from '../../constants'

type Type = {
  board: Board,
  hasThumbnail: boolean,
  hasAuthor: boolean,
  languageCode: Language,
  useInputContents: boolean,
  useInputSummary: boolean,
  useInputAuthor: boolean,
  useInputLink: boolean,
  useInputThumbnail: boolean
}

export default function DefaultBoard({
  useInputContents = false,
  useInputSummary = true,
  useInputAuthor = true,
  useInputLink = true,
  useInputThumbnail = true,
  board,
  hasThumbnail = false,
  hasAuthor = true,
  languageCode,
  recommendedImage
}: Type) {
  const [openPostModal, setOpenPostModal] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const loadPage = useCallback(
    (page) => {
      setWaiting(true);
      apis.boardController.getPosts(board.id, page, pageSize).then(response => {
        setPosts(response.data);
        setTotalPage(response.data.totalPages);
        setWaiting(false);
      }).catch(error => {
        console.error(error);
        alert(`${page + 1}페이지 불러오기에 실패했습니다.\n${util.getErrorMessage(error)}`);
        setWaiting(false);
      });
    },
    [setWaiting, setPosts, setTotalPage, setPosts],
  );

  useEffect(() => {
    loadPage(page);
    return undefined;
  }, [page]);

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
        {
          LoginStatus.hasBoardAuthority(board.id, constants.boardAuthorities.create) ?
            <Button className="float-right" onClick={() => (setOpenPostModal(true))}>작성</Button>
            : undefined
        }
      </h4>
      <table className="table mb-0">
        <thead className="bg-light">
          <tr>
            <th scope="col" className="border-0" style={{ width: 80 }}>#</th>
            {hasThumbnail && <th scope="col" className="border-0" style={{ width: 120 }}>썸네일</th>}
            <th scope="col" className="border-0">제목</th>
            {hasAuthor && <th scope="col" className="border-0" style={{ width: 150 }}>작성자</th>}
            {/* <th scope="col" className="border-0" style={{ width: 150 }}>게시</th> */}
          </tr>
        </thead>
        <tbody>
          {
            posts?.content?.map((item, key) => {
              return <tr key={key} style={{ cursor: 'pointer' }} onClick={() => (loadSelectedPost(item))}>
                <td>{item.id}</td>
                {hasThumbnail && <td className="thumb-td">{item.thumbnail ? <img src={item.thumbnail} alt="" /> : undefined}</td>}
                <td>{item.title}</td>
                {hasAuthor && <td>{item.author}</td>}
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
          recommendedImage={recommendedImage}
          useInputContents={useInputContents}
          useInputSummary={useInputSummary}
          useInputAuthor={useInputAuthor}
          useInputLink={useInputLink}
          useInputThumbnail={useInputThumbnail}
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
          recommendedImage={recommendedImage}
          useInputContents={useInputContents}
          useInputSummary={useInputSummary}
          useInputAuthor={useInputAuthor}
          useInputLink={useInputLink}
          useInputThumbnail={useInputThumbnail}
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