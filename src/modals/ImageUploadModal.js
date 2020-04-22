import React, { useState, useCallback } from 'react'
import Modal from './Modal'
import FileDropzone from '../components/FileDropzone'
import update from 'immutability-helper';
import apis from '../apis';
import Axios from 'axios';

export type Type = {
  onCloseRequest: () => void,
  onUploadSuccess: (string[]) => void,
  onUploadFailed: (Exception) => void,
};

export default function ({ onCloseRequest, onUploadSuccess, onUploadFailed }: Type) {
  const [files: onChangeParamType, setFiles] = useState([]);
  const [updateWaiting, setUpdateWaiting] = useState(false);

  const onUploadRequest = useCallback(async (): onChangeParamType => {
    setUpdateWaiting(true);
    try {
      const results = await Axios.all(files.map(item => (
        apis.dataController.uploadData("images", item.file)
      )));

      // eslint-disable-next-line no-unused-expressions
      onUploadSuccess ?.(results.map(item => (item.data.url)));
    } catch (error) {
      // eslint-disable-next-line no-unused-expressions
      onUploadFailed ?.(error);
    }
    setUpdateWaiting(false);
  }, [files, onCloseRequest, updateWaiting, onUploadSuccess, onUploadFailed]);

  return (
    <Modal title='Image upload' className="image-upload-modal" dialogClassName="col-md-4" onUploadRequest={onUploadRequest} onCloseRequest={onCloseRequest} footerActions={["close", "upload"]} uploadEnabled={!updateWaiting && files && files.length > 0}>
      <FileDropzone accept="image/*" fileProcessType={"data_url"} onChange={(newFiles) => {
        setFiles(update(files, { $push: newFiles.filter(item => item) }));
      }} />
      {
        files && files.length > 0 &&
        <div className="image-thumbs">
          {
            files.map((item, key) => {
              return <div className="image-thumb" key={key} >
                <img src={item.dataUrl} alt={key + 1} />
                <span
                  className="delete"
                  onClick={() => {
                    setFiles(update(files, { $splice: [[key, 1]] }))
                  }}>
                  delete
                </span>
              </div>
            })
          }
        </div>
      }
    </Modal>
  )
}
