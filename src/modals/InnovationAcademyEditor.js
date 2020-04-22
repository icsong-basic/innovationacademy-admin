import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { FormSelect, Form, FormInput } from "shards-react";
import FileDropzone from '../components/FileDropzone';
import ReactQuill from 'react-quill';
import apis from '../apis'
import update from 'immutability-helper';
import util from '../util'
import LoginStatus from '../data/singleton/LoginStatus'
import constants from '../constants'
import QuillEditor from '../components/QuillEditor'

const dialogStyle = {
    maxWidth: 800,
    width: 800
};

export default function InnovationAcademyEditor({
    editTarget,
    mode = 'write',
    onSubmitSuccess,
    onCloseRequest
}) {
    const [waiting, setWaiting] = useState(false)
    const [author, setAuthor] = useState(editTarget ?.author || '');
    const [title, setTitle] = useState(editTarget ?.title || '');
    const [contents, setContents] = useState(editTarget ?.contents || '');
    const [attachments, setAttachments] = useState(editTarget ?.attachments || '');
    const [selectedBoardId, setSelectedBoardId] = useState(editTarget ? editTarget.boardId : -1)
    const [boardLabels, setBoardLabels] = useState([])
    const [labels, setLabels] = useState(editTarget ? editTarget.labels : [])
    const [selectedAddingLabelId, setSelectedAddingLabelId] = useState('')

    useEffect(() => {
        setBoardLabels([])
        apis.boardController.getLabels(selectedBoardId).then(response => {
            setBoardLabels(response.data)
            setSelectedAddingLabelId(response.data.length > 0 ? response.data[0].id : '')
        }).catch(error => {
            console.error(error)
            setBoardLabels([])
        })
        return () => { };
    }, [selectedBoardId, setBoardLabels])

    const onSubmit = async () => {
        let attachmentParam = ''
        if (attachments) {
            if (typeof (attachments) === 'string') {
                attachmentParam = attachments
            } else {
                try {
                    attachmentParam = ((await apis.dataController.uploadData('file', attachments)).data.url)

                } catch (error) {
                    alert('이미지 업로드에 실패했습니다.')
                }
            }
        }

        const postingInput = {
            "author": author,
            "title": title,
            "thumbnail": '',
            "image": '',
            "summary": '',
            "contents": contents,
            "link": '',
            "attachments": attachmentParam
        }

        if (selectedBoardId < 0) {
            window.alert('카테고리가 지정되어있지 않습니다.')
            return
        }

        if (mode === 'write') {
            try {
                setWaiting(true)
                const response = await apis.boardController.post(selectedBoardId, [postingInput])
                if (labels && labels.length > 0) {
                    for (let label of labels) {
                        await apis.boardController.addLabelToPost(selectedBoardId, response.data[0].id, label.id)
                    }
                }
                if (onSubmitSuccess) {
                    onSubmitSuccess()
                }
            } catch (error) {
                alert(error ?.response ?.data ?.message || '게시물 등록에 실패했습니다.')
                setWaiting(false)
            }
        } else {
            try {
                await apis.boardController.put(selectedBoardId, editTarget.id, postingInput)
                if (onSubmitSuccess) {
                    onSubmitSuccess()
                }
            } catch (error) {
                alert(error ?.response ?.data ?.message || '게시물 수정에 실패했습니다.')
            }
        }
    }

    const onDelete = async () => {
        if (!window.confirm('삭제하시겠습니까?')) {
            return;
        }
        try {
            await apis.boardController.delete(selectedBoardId, editTarget.id)
            // eslint-disable-next-line no-unused-expressions
            onSubmitSuccess ?.();
        } catch (error) {
            alert(util.getErrorMessage(error));
            return;
        }
    };

    const getFooterActions = () => {
        const result = ["close"]
        if (mode === "write") {
            if (LoginStatus.hasBoardAuthority(selectedBoardId, constants.boardAuthorities.create)) {
                result.push("submit")
            }
        } else {
            if (LoginStatus.hasBoardAuthority(selectedBoardId, constants.boardAuthorities.modify)) {
                result.push("save_changes")
            }
            if (LoginStatus.hasBoardAuthority(selectedBoardId, constants.boardAuthorities.delete)) {
                result.push("delete")
            }
        }
        
        return result;
    }

    return (
        <Modal
            submitEnabled={!waiting}
            onCloseRequest={onCloseRequest}
            footerActions={getFooterActions()}
            onSubmitRequest={onSubmit}
            onSaveChangeRequest={onSubmit}
            onDeleteRequest={onDelete}
            dialogStyle={dialogStyle}
        >
            <Form className="add-new-post">

                {
                    mode === "write" ?
                        <>
                            <b>카테고리</b>
                            <FormSelect size="lg" className="mb-3" placeholder="카테고리" onChange={(e) => {
                                setLabels([]); setSelectedBoardId(parseInt(e.target.value))
                            }} value={selectedBoardId}>
                                <option disabled value={-1}>없음</option>
                                {
                                    LoginStatus.hasBoardAuthority(3,
                                        mode === "write" ?
                                            constants.boardAuthorities.create :
                                            constants.boardAuthorities.modify) ?
                                        <option value={3}>정보공개</option> :
                                        undefined}
                                {
                                    LoginStatus.hasBoardAuthority(4,
                                        mode === "write" ?
                                            constants.boardAuthorities.create :
                                            constants.boardAuthorities.modify) ?
                                        <option value={4}>알림</option> :
                                        undefined}
                            </FormSelect>
                        </> : undefined
                }
                {
                    boardLabels && boardLabels.length > 0 &&
                    <div>
                        <b>말머리</b><br />
                        {
                            labels.map((item, key) => {
                                return <div key={key} className="badge-container">{item.name}
                                    {
                                        LoginStatus.hasBoardAuthority(selectedBoardId, constants.boardAuthorities.modify) ?
                                            < div
                                                className="delete-btn"
                                                onClick={() => {
                                                    if (mode === "edit") {
                                                        apis.boardController.removeLabelToPost(selectedBoardId, editTarget.id, item.id).then(response => {
                                                            setLabels(update(labels, { $splice: [[key, 1]] }))
                                                        }).catch(error => {
                                                            alert(util.getErrorMessage(error, '라벨 삭제에 실패했습니다.'))
                                                        });
                                                    } else {
                                                        const removeIndex = labels.findIndex(label => label.id === item.id);
                                                        if (removeIndex >= 0)
                                                            setLabels(update(labels, { $splice: [[removeIndex, 1]] }))
                                                    }
                                                }}>
                                                𝖷
                                        </div>
                                            : undefined
                                    }
                                </div>
                            })
                        }
                        {
                            LoginStatus.hasBoardAuthority(selectedBoardId, constants.boardAuthorities.modify) ?
                                <div className="display-inline-block">
                                    <FormSelect className="mb-1" value={selectedAddingLabelId} onChange={e => setSelectedAddingLabelId(parseInt(e.target.value))} style={{ width: 'auto' }}>
                                        {
                                            boardLabels.map((item, key) => <option key={key} value={item.id}>{item.name}</option>)
                                        }
                                    </FormSelect>
                                    <button type="button" className="btn mb-1 btn-primary" onClick={() => {
                                        if (labels.find(item => item.id === selectedAddingLabelId)) {
                                            alert('이미 추가되어있습니다.')
                                        } else {
                                            if (mode === "edit") {
                                                apis.boardController.addLabelToPost(selectedBoardId, editTarget.id, selectedAddingLabelId).then(response => {
                                                    setLabels(update(labels, { $push: [boardLabels.find(label => label.id === selectedAddingLabelId)] }))
                                                }).catch(error => {
                                                    alert(util.getErrorMessage(error, '라벨 추가에 실패했습니다.'))
                                                });
                                            } else {
                                                setLabels(update(labels, { $push: [boardLabels.find(label => label.id === selectedAddingLabelId)] }))
                                            }
                                        }
                                    }}>
                                        추가
                                    </button>
                                </div>
                                : undefined
                        }
                        {mode === "edit" && <p>· 말머리는 추가/삭제시 저장버튼을 클릭하지 않아도 바로 반영됩니다.</p>}
                    </div>
                }
                <b>작성자</b>
                <FormInput size="lg" className="mb-3" placeholder="작성자" value={author} onChange={e => { setAuthor(e.target.value) }} />
                <b>제목</b>
                <FormInput size="lg" className="mb-3" placeholder="제목" value={title} onChange={e => { setTitle(e.target.value) }} />
                <b>본문</b>
                <QuillEditor className="add-new-post__editor mb-1" value={contents} onChange={v => { setContents(v) }} />
                <div>
                    <b>첨부파일</b><br />
                    {attachments ?
                        <>
                            {typeof (attachments) === 'string' ? <a target="_blank" rel="noopener noreferrer" href={attachments}>{attachments}</a> : attachments.name}
                            <button type="button" className="btn btn-danger" onClick={() => { setAttachments(null) }}>삭제</button>
                        </> :
                        <FileDropzone fileProcessType="origin" onChange={files => { files.length > 0 ? setAttachments(files[0]) : setAttachments(null) }} />
                    }
                </div>
            </Form>
        </Modal >
    )
}