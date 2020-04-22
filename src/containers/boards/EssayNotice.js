import React from 'react'
import MultipleBoard from './MultipleBoard'

export default function EssayNotice() {
    return (
        <MultipleBoard
            pathName="/essay-notice"
            boardIds={[9]}
            pageName="에세이 공지사항"
            useInputContents={true}
            useInputSummary={false}
            useInputAuthor={false}
            useInputLink={false}
            useInputThumbnail={false}
        />
    )
}
