import React from 'react'
import { Modal, Button, Row, Col, Space } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

type DaoChuWenJianSuccessProps = {
    visible: boolean
    onClose: () => void
    errorStr?: string
}

// 导出文件结果Modal
const DaoChuWenJianJieGuoModal: React.FC<DaoChuWenJianSuccessProps> = ({ visible, onClose, errorStr }) => {

    const getTitle = (): React.ReactNode => {
        if (errorStr) {
            return <>
                <Space>
                    <CloseCircleTwoTone twoToneColor="red" style={{ fontSize: '150%' }} />
                    <span>导出任务失败</span>
                </Space>
            </>;
        }
        return <>
            <Space>
                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '150%' }} />
                <span>导出任务提交成功</span>
            </Space>
        </>;
    }

    return (
        <Modal
            visible={visible}
            title={getTitle()}
            onCancel={onClose}
            footer={false}
        >
            <Row>
                <span>{errorStr || "请前往右上角的“导入导出”进行下载"}</span>
            </Row>
            <Row justify="end">
                <Col>
                    <Button type="default" onClick={onClose}>我知道了</Button>
                </Col>
            </Row>
        </Modal >
    )
}

export default DaoChuWenJianJieGuoModal
