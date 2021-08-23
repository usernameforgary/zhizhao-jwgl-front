import React from 'react'
import { XueYuanDaoKeZhuangTai } from '../../customtypes'
import { convertXueYuanDaoKeZhuangTai2Text } from '../../utils/converter'
import ZhuangTianSpan from './ZhuangTaiSpan'

type DaoKeZhuangTaiSpanProps = {
    daoKeZhuangTai: XueYuanDaoKeZhuangTai
}
const DaoKeZhuangTaiSpan: React.FC<DaoKeZhuangTaiSpanProps> = ({ daoKeZhuangTai }) => {
    const content: string = convertXueYuanDaoKeZhuangTai2Text(daoKeZhuangTai);
    let result = <></>;
    switch (daoKeZhuangTai) {
        case XueYuanDaoKeZhuangTai.DAO_KE:
            result = <ZhuangTianSpan content={content} className={"daoke"} />;
            break;
        case XueYuanDaoKeZhuangTai.CHI_DAO:
            result = <ZhuangTianSpan content={content} className={"chidao"} />;
            break;
        case XueYuanDaoKeZhuangTai.QING_JIA:
            result = <ZhuangTianSpan content={content} className={"qingjia"} />;
            break;
        case XueYuanDaoKeZhuangTai.WEI_DAO:
            result = <ZhuangTianSpan content={content} className={"weidao"} />;
            break;
        default:
            break;
    }

    return result;
}

export default DaoKeZhuangTaiSpan
