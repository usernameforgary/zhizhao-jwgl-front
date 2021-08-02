import React from 'react'
import { BanJiView } from '../../../../customtypes'

type DianMingQingKuangProps = {
    banJiXiangQing: BanJiView | undefined
}

const DianMingQingKuang: React.FC<DianMingQingKuangProps> = ({ banJiXiangQing }) => {
    return (
        <>
            {banJiXiangQing?.banJiLaoShiXingMing}
        </>
    )
}

export default DianMingQingKuang
