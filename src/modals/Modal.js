// @flow

import React from 'react';
import type { Node } from 'react';
import ReactDOM from "react-dom";

const modalRoot: ?Element = document.getElementById('modal-root');

export type footerAction = "close" | "save_changes" | "ok" | "upload" | "submit" | "publish" | "cancel_publish" | "delete"
export type footerActionFunction = () => void
export type Props = {
    dialogStyle: any,
    contentStyle: any,
    title?: string,
    className?: string,
    dialogClassName?: string,
    visibleCloseButton: boolean,
    uploadEnabled: boolean,
    submitEnabled?: boolean,
    children?: Node,
    onCloseRequest?: footerActionFunction,
    onOkRequest?: footerActionFunction,
    onSaveChangeRequest?: footerActionFunction,
    onSubmitRequest?: footerActionFunction,
    onOkRequest?: footerActionFunction,
    onUploadRequest?: footerActionFunction,
    onPublishRequest?: footerActionFunction,
    onCancelPublishRequest?: footerActionFunction,
    onDeleteRequest?: footerActionFunction,
    footerActions: footerAction[],
    footerCustomActions: ?Node[]
};


export default function Modal({
    children,
    title,
    className = '',
    dialogClassName = '',
    visibleCloseButton = true,
    footerActions = ["close"],
    footerCustomActions,
    onSaveChangeRequest,
    onSubmitRequest,
    onCloseRequest,
    onOkRequest,
    onUploadRequest,
    onPublishRequest,
    onCancelPublishRequest,
    onDeleteRequest,
    dialogStyle,
    contentStyle,
    uploadEnabled = false,
    submitEnabled = true,
}: Props) {
    const renderFotterActionItem = (item: footerAction, key) => {
        switch (item) {
            case "close":
                return <button key={key} type="button" className="btn btn-secondary" datadismiss="modal" onClick={onCloseRequest}>닫기</button>;
            case "save_changes":
                return <button key={key} type="button" className="btn btn-primary" onClick={onSaveChangeRequest}>변경사항 저장</button>;
            case "submit":
                return <button key={key} type="button" className="btn btn-primary" onClick={onSubmitRequest}>제출</button>;
            case "ok":
                return <button key={key} type="button" className="btn btn-primary" onClick={onOkRequest} disabled={!submitEnabled}>확인</button>;
            case "upload":
                return <button key={key} type="button" className="btn btn-primary" onClick={onUploadRequest} disabled={!uploadEnabled}>업로드</button>;
            case "publish":
                return <button key={key} type="button" className="btn btn-success" onClick={onPublishRequest} >게시</button>;
            case "cancel_publish":
                return <button key={key} type="button" className="btn btn-warning" onClick={onCancelPublishRequest} >게시 취소</button>;
            case "delete":
                return <button key={key} type="button" className="btn btn-danger" onClick={onDeleteRequest} >삭제</button>;
            default:
                return null;
        }
    };

    return ReactDOM.createPortal(
        <div className={`modal ${className}`} tabIndex="-1" role="dialog">
            <div className={`modal-dialog ${dialogClassName}`} role="document" style={dialogStyle}>
                <div className="modal-content" style={contentStyle}>
                    {
                        title &&
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            {
                                visibleCloseButton &&
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCloseRequest}>
                                    <span aria-hidden="true">×</span>
                                </button>
                            }
                        </div>
                    }
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        {
                            footerActions && footerActions.length > 0 && footerActions.map((item, key) => {
                                const actionComponent = renderFotterActionItem(item, key);
                                return actionComponent ? actionComponent : null;
                            })
                        }
                        {
                            footerCustomActions && footerCustomActions.length > 0 && footerCustomActions.map((item, key) => {
                                //$FlowFixMe
                                return <item.type {...item.props} key={`custom-action-${key}`} />;
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        //$FlowFixMe
        , (modalRoot: Element)
    );
}
