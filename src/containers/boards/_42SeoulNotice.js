import React from 'react'
import MultipleBoard from './MultipleBoard'

export default function _42SeoulNNotice() {
    return (
        <MultipleBoard
            pathName="/42seoul-notice-popup"
            boardIds={[7]}
            pageName="42 Seoul Notice Popup"
            useInputContents={true}
            useInputSummary={false}
            useInputAuthor={false}
            useInputLink={false}
            useInputThumbnail={false}
        />
    )
}
