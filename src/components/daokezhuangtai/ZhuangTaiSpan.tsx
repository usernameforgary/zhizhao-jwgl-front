import React from 'react'

import './zhuangtaispan.css'

type ZhuangTianSpanProps = {
    content: string,
    className: string
}

const ZhuangTianSpan: React.FC<ZhuangTianSpanProps> = ({ content, className }) => {
    return (
        <span className={className}>
            {content}
        </span>
    )
}

export default ZhuangTianSpan
