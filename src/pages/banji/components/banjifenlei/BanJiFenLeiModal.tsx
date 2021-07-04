import { Button, Modal, Row } from 'antd';
import React from 'react';
import { BanJiFenLei } from '../../../../customtypes';

export type BanJiFenLeiProps = {
    visible: boolean
    modalTitle: string
    onClose: () => void
    list: BanJiFenLei[],
    refresh: () => void
}

const BanJiFenLeiModal: React.FC<BanJiFenLeiProps> = ({ visible, modalTitle, onClose, list, refresh }) => {
    return (
        <>
            <Modal
                visible={visible}
                title={modalTitle ?? "新增班级"}
                onCancel={onClose}
                footer={false}
            >
                <Row>
                    <Button type="primary">添加</Button>
                </Row>
                <Row>
                </Row>
            </Modal >
        </>
    )
}

export default BanJiFenLeiModal;
