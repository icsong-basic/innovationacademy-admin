import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import apis from '../apis';
import { stateToHTML } from 'draft-js-export-html';

type Type = {
    placeholder: ?string,
    value: string,
    onChange: (string) => void
};

export function HtmlToEditorState(html) {
    if (!html) {
        return EditorState.createEmpty();
    }
    try {
        const blocksFromHTML = convertFromHTML(html);
        const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        return EditorState.createWithContent(state);
    } catch (error) {
        return EditorState.createEmpty();
    }
}

export function EditorStateToHtml(state) {
    return stateToHTML(state.getCurrentContent());
}

export default function ({ value, onChange, placeholder }: Type) {
    return (
        <Editor
            editorState={value}
            onEditorStateChange={onChange}
            wrapperClassName="editor-wrapper"
            editorClassName="editor"
            toolbar={toolbar}
            localization={{ locale: 'ko' }} />
    )
}

const toolbar = {
    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'remove', 'history'],
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: true },
    image: { uploadCallback: uploadImageCallBack, previewImage: true, alt: { present: true, mandatory: false } },
};

function uploadImageCallBack(file) {
    return new Promise(
        async (resolve, reject) => {
            try {
                const result = await apis.dataController.uploadData("images", file)
                const link = `${window.location.protocol}//${window.location.host}/api${result.data.url}`;
                resolve({ data: { link } });
            } catch (error) {
                reject(error);
            }
        }
    );
}