import { Row, Button } from 'antd';
import React from 'react';
import { useState } from 'react';
import { BanJiView } from '../../../../customtypes';
import PaiKeModal from './PaiKeModal';

/**
 * keChengMingCheng（课程名称）只需要显示
 * banJiId（班级Id）和banJiMingCheng（班级名称），由父组件传入，页面上不可编辑
 */
export type PaiKeXinXiProps = {
    banJiXiangQing: BanJiView | undefined
}

const PaiKeXinXi: React.FC<PaiKeXinXiProps> = ({ banJiXiangQing }) => {
    const [showPaiKeModal, setShowPaiKeModal] = useState<boolean>(false);

    const toggleShowPaiKeModal = () => {
        setShowPaiKeModal(!showPaiKeModal);
    }

    return (
        <>
            <Row>
                <Button type="primary" onClick={toggleShowPaiKeModal}>一键排课</Button>
            </Row>
            <Row>
            </Row>
            {showPaiKeModal ?
                <PaiKeModal
                    visible={showPaiKeModal}
                    banJiXiangQing={banJiXiangQing}
                    onCancel={toggleShowPaiKeModal} />
                : ""
            }
        </>
    )
}

export default PaiKeXinXi
