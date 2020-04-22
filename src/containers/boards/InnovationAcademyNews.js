import React from 'react'
import MultipleBoard from './MultipleBoard'

export default function _42SeoulNews() {
    return (
        <MultipleBoard
            recommendedImage="가로:세로 비율 156:85 인 이미지를 권장합니다. (최대 20mb)"
            pathName="/innovationacademy-news"
            boardIds={[5, 6]}
            pageName="I.A News"
        />
    )
}
