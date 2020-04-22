import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export type fileProcessTypes = "origin" | "binary_string" | "data_url"
export type onChangeParamType = ?File[] | ?{ file: File, dataUrl: string }[];

type Type = {
    placeholder: ?string,
    accept: ?string,
    fileProcessType: fileProcessTypes,
    onChange: (onChangeParamType) => void
}

export default function ({ accept, onChange, fileProcessType = "origin", placeholder = "파일을 여기 드래그하거나,<br /> or 클릭해서 파일을 선택하세요.<br/>(최대 20mb)" }: Type) {
    const onDrop = useCallback(async acceptedFiles => {
        switch (fileProcessType) {
            case "origin":
                // FIXME: eslint 'no-unused-expressions' issue, link: https://github.com/babel/babel-eslint/issues/595#issuecomment-417284117
                // eslint-disable-next-line no-unused-expressions
                onChange?.(acceptedFiles);
                break;
            case "binary_string":
                // TODO:
                break;
            case "data_url":
                const fileReadPromises = await Promise.all(acceptedFiles.map(async (file) => {
                    const promise = new Promise((resolve) => {
                        const fileReader = new FileReader();
                        fileReader.onloadend = (e) => {
                            const dataURL = e.target.result;
                            resolve({ file, dataUrl: dataURL });
                        };
                        fileReader.onabort = () => (resolve(null));
                        fileReader.onerror = () => (resolve(null));
                        fileReader.readAsDataURL(file);
                    });
                    const result = await promise;
                    return result;
                }));
                // FIXME: eslint 'no-unused-expressions' issue, link: https://github.com/babel/babel-eslint/issues/595#issuecomment-417284117
                // eslint-disable-next-line no-unused-expressions
                onChange?.(fileReadPromises);
                break;
            default:
                break;
        }
    }, [fileProcessType, onChange]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept
    });

    return (
        <div {...getRootProps()} className="file-dropzone">
            <input {...getInputProps()} />
            <div>
                <i className="material-icons">attachment</i>
                <p dangerouslySetInnerHTML={{ __html: placeholder }} />
            </div>
        </div>
    )
}