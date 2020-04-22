import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { Button, Form, FormInput } from "shards-react";
import apis from '../apis'
import update from 'immutability-helper';
import constants from '../constants'
import LoginStatus from '../data/singleton/LoginStatus'

const dialogStyle = {
    maxWidth: 800,
    width: 800
};

const boardIds = [3, 4]

export default function LabelEditorModal({
    editTarget,
    onSubmitSuccess,
    onCloseRequest
}) {
    const [boardList, setBoardList] = useState([]);
    useEffect(() => {
        fetchDatas()
        return () => { };
    }, []);

    const [addingLabelNames, setAddingLabelNames] = useState(['', ''])

    const fetchDatas = () => {
        apis.boardController.getList().then(response => {
            setBoardList(response.data.filter((board) => (boardIds.find(boardId => boardId === board.id))))
        }).catch(error => {
            alert('게시판 정보를 불러올 수 없습니다.')
        })
    }

    return (
        <Modal
            onCloseRequest={onCloseRequest}
            dialogStyle={dialogStyle}
        >
            <Form className="add-new-post">
                {
                    boardList.map((board, boardIndex) => {
                        return <div className="mb-3">
                            <h4>{board.name}</h4>
                            {
                                board.labels.map((label, labelIndex) => {
                                    return <div key={labelIndex} className="badge-container">{label.name}
                                        {
                                            LoginStatus.hasBoardAuthority(board.id, constants.boardAuthorities.labelDelete) ?
                                                < div
                                                    className="delete-btn"
                                                    onClick={() => {
                                                        apis.boardController.deleteLabel(board.id, label.id).then(response => {
                                                            fetchDatas();
                                                        }).catch(error => {
                                                            alert(error ?.response ?.data ?.message || error.toString())
                                                        })
                                                    }}>
                                                    𝖷
                                        </div>
                                                : undefined
                                        }
                                    </div>
                                })
                            }
                            {
                                LoginStatus.hasBoardAuthority(board.id, constants.boardAuthorities.labelCreate) ?
                                    <div>
                                        <FormInput
                                            style={{ width: 'auto', verticalAlign: 'top', display: 'inline-block' }}
                                            value={addingLabelNames[boardIndex]}
                                            onChange={(e) => {
                                                setAddingLabelNames(update(addingLabelNames, { [boardIndex]: { $set: e.target.value } }))
                                            }}
                                            placeholder="추가할 말머리 명"
                                        />
                                        <Button
                                            style={{ verticalAlign: 'top' }}
                                            onClick={() => {
                                                apis.boardController.addLabel(board.id, addingLabelNames[boardIndex]).then(response => {
                                                    fetchDatas();
                                                }).catch(error => {
                                                    alert(error ?.response ?.data ?.message || error.toString())
                                                })
                                            }}>
                                            추가
                                         </Button>
                                    </div>
                                    : undefined
                            }
                        </div>
                    })
                }
            </Form>
        </Modal >
    )
}