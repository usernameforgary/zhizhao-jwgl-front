import React from 'react'
import { XueYuanZhuangTai } from '../../customtypes'

import './tagxueyuanzhuangtai.css'

type TagXueYuanZhuangTaiProps = {
    xueYuanZhuangTai: XueYuanZhuangTai | undefined
    style?: React.CSSProperties | undefined
    className?: string | undefined
}
const TagXueYuanZhuangTai: React.FC<TagXueYuanZhuangTaiProps> = ({ xueYuanZhuangTai, style, className }): JSX.Element => {
    let result = <></>;

    if (xueYuanZhuangTai) {
        switch (xueYuanZhuangTai) {
            case XueYuanZhuangTai.ZAI_DU:
                result = <span style={style} className={"tag-xueyuanzhuangtai tag-xueyuanzhuangtai-zaidu " + className} >在读学员</span>;
                break;
            case XueYuanZhuangTai.QIAN_ZAI:
                result = <span style={style} className={"tag-xueyuanzhuangtai tag-xueyuanzhuangtai-qianzai " + className} >潜在学员</span>;
                break;
            case XueYuanZhuangTai.LI_SHI:
                result = <span style={style} className={"tag-xueyuanzhuangtai tag-xueyuanzhuangtai-lishi " + className} >历史学员</span>;
                break;
            default:
                break;
        }
    }

    return result;
}

export default TagXueYuanZhuangTai
