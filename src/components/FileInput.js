// @flow

import React from 'react'

type Type = {
    multiple: false,
    onChange: (?File | ?FileList) => void
}
export default function ({ multiple = false, onChange }: Type) {
    const onInputChange = (e) => {
        if (!onChange) {
            return;
        }

        const files = e.target.files;
        if (multiple) {
            onChange(files);
        } else {
            onChange(files.length > 0 ? files[0] : null);
        }
    };
    return (<>
        <input type="file" onChange={onInputChange} multiple={multiple} />
    </>)
}
