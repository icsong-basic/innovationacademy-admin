import React from 'react'
import MultipleBoard from './MultipleBoard'

export default function _42SeoulNews() {
    return (
        <MultipleBoard
            recommendedImage={
                {
                    1: "가로:세로 비율 8:7 인 이미지를 권장합니다. (최대 20mb)",
                    2: "가로:세로 비율 64:35 인 이미지를 권장합니다. (최대 20mb)"
                }
            }
            pathName="/42seoul-news"
            boardIds={[1, 2]}
            pageName="42 Seoul News"
        />
    )
}
