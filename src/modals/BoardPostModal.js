import React, { useState, useCallback } from 'react'
import Modal from './Modal'
import type { footerActionFunction } from './Modal';
import type { Board } from '../apiModelTypes';
import { Button, FormTextarea, Form, FormInput } from "shards-react";
import FileInput from '../components/FileInput';
import apis from '../apis';
import util from '../util';
import LoginStatus from '../data/singleton/LoginStatus'
import constants from '../constants'
import ReactQuill from 'react-quill';
import QuillEditor from '../components/QuillEditor'

type Type = {
    mode: 'edit' | 'write',
    board: Board,
    onCloseRequest: footerActionFunction,
    onSubmitSuccess: footerActionFunction,
    initialPostingInput: ?PostingInput
};

const dialogStyle = {
    maxWidth: 800,
    width: 800
};

export default function BoardPostModal({
    initialPostingInput,
    useInputContents = false,
    useInputSummary = true,
    useInputAuthor = true,
    useInputLink = true,
    useInputThumbnail = true,
    mode = 'write',
    onSubmitSuccess,
    onCloseRequest,
    board,
    recommendedImage
}: Type) {
    const contentsEditable = board !== 'gallery' && board !== 'video';

    const [title, setTitle] = useState(initialPostingInput?.title || '');
    const [link, setLink] = useState(initialPostingInput?.link || '');
    const [author, setAuthor] = useState(initialPostingInput?.author || '');

    // TODO: 최적화 필요.
    const [summary, setSummary] = contentsEditable ? useState(initialPostingInput?.summary || "") : '';
    const [contents, setContents] = contentsEditable ? useState(initialPostingInput?.contents || "") : '';
    const [attachment, setAttachment] = useState('');
    const [attachmentLink, setAttachmentLink] = useState(initialPostingInput?.thumbnail || ''); // edit mode에서 사용.
    const onSubmit = (async () => {
        if (!title) {
            alert('제목을 입력하셔야 합니다.');
            return;
        }

        let attachmentLinkParam = attachmentLink;
        if (attachment) {
            try {
                let result = await apis.dataController.uploadData('file', attachment);
                const url = result.data.url;
                attachmentLinkParam = url;
            } catch (error) {
                alert(util.getErrorMessage(error));
                return;
            }
        }

        const params = {
            "title": title,
            "author": author,
            "summary": summary,
            "thumbnail": attachmentLinkParam,
            "image": "",
            "contents": contents,
            "link": link
        };

        if (mode === 'write') {
            apis.boardController.post(board.id, [params]).then(response => {
                if (onSubmitSuccess) onSubmitSuccess();
            }).catch(error => {
                console.error(error)
                alert(util.getErrorMessage(error));
            })
        } else {
            apis.boardController.put(board.id, initialPostingInput.id, params).then(response => {
                if (onSubmitSuccess) onSubmitSuccess();
            }).catch(error => {
                alert(util.getErrorMessage(error));
            })
        }
    });

    const onDelete = useCallback(async () => {
        if (!window.confirm('삭제하시겠습니까?')) {
            return;
        }
        try {
            await apis.boardController.delete(board.id, initialPostingInput.id)
            // eslint-disable-next-line no-unused-expressions
            onSubmitSuccess?.();
        } catch (error) {
            alert(util.getErrorMessage(error));
            return;
        }
    }, [onSubmitSuccess, board, initialPostingInput]);

    const onPublish = useCallback(async () => {
        try {
            await apis.boardController.publish(board.id, initialPostingInput.id)
            // eslint-disable-next-line no-unused-expressions
            onSubmitSuccess?.();
        } catch (error) {
            alert(util.getErrorMessage(error));
            return;
        }
    }, []);

    const onCancelPublish = useCallback(async () => {
        try {
            await apis.boardController.cancelPublish(board.id, initialPostingInput.id)
            // eslint-disable-next-line no-unused-expressions
            onSubmitSuccess?.();
        } catch (error) {
            alert(util.getErrorMessage(error));
            return;
        }
    }, []);

    const renderDefaultEditor = () => {
        return <>
            <b>제목</b>
            <FormInput size="lg" className="mb-3" placeholder="제목" value={title} onChange={(e) => (setTitle(e.target.value))} />
            {
                useInputAuthor &&
                <><b>출처</b>
                    <FormInput size="lg" className="mb-3" placeholder="Youtube, Twitter ..." value={author} onChange={(e) => (setAuthor(e.target.value))} />
                </>
            }

            {
                useInputLink &&
                <>
                    <b>링크</b>
                    <FormInput size="lg" className="mb-3" placeholder="" value={link} onChange={(e) => (setLink(e.target.value))} />
                </>
            }
            {
                useInputSummary && <>
                    <b>설명</b>
                    <FormTextarea size="lg" className="mb-3" placeholder="" value={summary} onChange={(e) => (setSummary(e.target.value))} />
                </>
            }
            {
                useInputContents &&
                <>
                    <b>내용</b>
                    <QuillEditor
                        className="mb-3"
                        value={contents}
                        onChange={(newVal) => (setContents(newVal))}
                    />
                </>
            }
            {
                useInputThumbnail && (
                    mode === "write" ?
                        <>
                            <p style={{ margin: "1em 0 0.5em" }}><b>이미지</b></p>
                            {recommendedImage ? <p style={{ margin: "1em 0 0.5em" }}>{recommendedImage}</p> : ''}
                            <FileInput onChange={(file) => (setAttachment(file))} />
                        </> :
                        <>
                            <p style={{ margin: "1em 0 0.5em" }}><b>이미지</b></p>
                            {recommendedImage ? <p style={{ margin: "1em 0 0.5em" }}>{recommendedImage}</p> : ''}
                            {
                                attachmentLink ?
                                    <p>{attachmentLink ? <img src={attachmentLink} style={{ height: 200, marginBottom: 10 }} alt="" /> : undefined}<br />
                                        <Button theme="danger" size="sm" onClick={() => { setAttachmentLink('') }}>삭제</Button></p> :
                                    <FileInput onChange={(file) => (setAttachment(file))} />
                            }
                        </>
                )
            }
            {
                mode === "edit" ?
                    <>
                        <p style={{ margin: "2em 0 0.5em" }}><b>최초 게시일시:</b> {util.timeToString(initialPostingInput?.publishedAt)}</p>
                        <p style={{ margin: "0.5em 0 0.5em" }}><b>최종 수정일시:</b> {util.timeToString(initialPostingInput?.writeAt)}</p>
                    </> : undefined
            }
        </>
    }

    const renderEditor = () => {
        switch (board.name?.toLowerCase()) {
            default:
                return renderDefaultEditor();
        }
    }

    const getFooterActions = () => {
        if (mode === "write") {
            return ["close", "submit"];
        }
        const result = ["close"];
        if (LoginStatus.hasBoardAuthority(board.id, constants.boardAuthorities.modify)) {
            result.push("save_changes")
        }
        if (LoginStatus.hasBoardAuthority(board.id, constants.boardAuthorities.delete)) {
            result.push("delete")
        }
        return result;
    }

    return (
        <Modal
            onCloseRequest={onCloseRequest}
            footerActions={getFooterActions()}
            onSubmitRequest={onSubmit}
            onSaveChangeRequest={onSubmit}
            onDeleteRequest={onDelete}
            onPublishRequest={onPublish}
            onCancelPublishRequest={onCancelPublish}
            dialogStyle={dialogStyle}>
            <Form className="add-new-post">
                {renderEditor()}
            </Form>
        </Modal>
    )
}