import React from 'react'
import MultipleBoard from './MultipleBoard'

export default function InnovationAcademyNotice() {
    return (
        <MultipleBoard
            pathName="/innovationacademy-notice-popup"
            boardIds={[8]}
            pageName="I.A Notice Popup"
            useInputContents={true}
            useInputSummary={false}
            useInputAuthor={false}
            useInputLink={false}
            useInputThumbnail={false}
        />
    )
}
