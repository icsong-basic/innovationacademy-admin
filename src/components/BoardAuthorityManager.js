import React, { useState, useEffect } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    FormCheckbox,
} from "shards-react";
import update from 'immutability-helper';
import apis from '../apis';
import util from '../util';

export default function BoardAuthorityManager({ user, onUserUpdate }) {
    const [boards, setBoards] = useState([]);
    const [boardAuthorizations, setBoardAuthorizations] = useState([]);

    useEffect(() => {
        const boardIds = boards.map(item => item.id);
        setBoardAuthorizations(getInitialBoardAuthorization(user, boardIds));
        return () => { };
    }, [user, boards])

    useEffect(() => {
        apis.boardController.getList().then(response => {
            setBoards(response.data);
        }).catch(error => {
            alert(error ?.response ?.data ?.message || '게시판 리스트를 불러올 수 없습니다.');
        })
        return () => { };
    }, [])

    const saveBoardAuth = async (boardAuth) => {
        return apis.adminController.setBoardRole(user.id, boardAuth.board.id, {
            board: boardAuth.board,
            create: boardAuth.create,
            modify: boardAuth.modify,
            delete: boardAuth.delete,
            labelCreate: boardAuth.labelCreate,
            labelModify: boardAuth.labelModify,
            labelDelete: boardAuth.labelDelete,
        })
    }

    return (
        <Card small className="mb-4">
            <CardHeader className="border-bottom">
                <b>게시판 권한</b>
            </CardHeader>
            <CardBody>
                <table className="table mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th scope="col" className="border-0">이름</th>
                            <th scope="col" className="border-0">작성</th>
                            <th scope="col" className="border-0">수정</th>
                            <th scope="col" className="border-0">삭제</th>
                            <th scope="col" className="border-0">말머리 생성</th>
                            <th scope="col" className="border-0">말머리 수정</th>
                            <th scope="col" className="border-0">말머리 삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            boardAuthorizations.map((boardAuth, boardAuthKey) => {
                                return <tr key={boardAuthKey}>
                                    <td>
                                        {boardAuth.board.name || boards.find(board => board.id === boardAuth.board.id) ?.name}
                                    </td>
                                    {
                                        ["create", "modify", "delete", "labelCreate", "labelModify", "labelDelete"].map((
                                            (authKey, key) =>
                                                <td key={key}>
                                                    <FormCheckbox toggle checked={boardAuth[authKey]} onChange={async (e) => {
                                                        const newBoardAuth = update(boardAuthorizations, {
                                                            [boardAuthKey]: {
                                                                [authKey]: { $set: !boardAuth[authKey] }
                                                            }
                                                        });

                                                        try {
                                                            await saveBoardAuth(newBoardAuth[boardAuthKey])
                                                            setBoardAuthorizations(newBoardAuth);
                                                            if (onUserUpdate) {
                                                                onUserUpdate()
                                                            }
                                                        } catch (error) {
                                                            alert(util.getErrorMessage(error) || '게시판 권한 설정에 실패했습니다.')
                                                        }
                                                    }} />
                                                </td>
                                        ))
                                    }
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </CardBody>
        </Card>
    )
}

function getInitialBoardAuthorization(user, boardIds) {
    const result = [];
    for (let boardId of boardIds) {
        const userBoardAuth = user.boardAuthorizations.find(boardAuth => boardAuth.board.id === boardId);
        const boardAuth =
            userBoardAuth ?
                update(userBoardAuth, {}) :
                {
                    "board": { "id": boardId },
                    "create": false,
                    "modify": false,
                    "delete": false,
                    "labelCreate": false,
                    "labelModify": false,
                    "labelDelete": false
                }
        result.push(boardAuth);
    }
    return result;
}