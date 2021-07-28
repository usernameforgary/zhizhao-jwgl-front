import React, { useState } from 'react'
import Modal from 'antd/lib/modal/Modal'
import { Radio, RadioChangeEvent, Space, Row, Col, Button } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

type JiaoFenQueRenModalProps = {
    visible: boolean
    onJiaoFeiQueRen: (value: string) => void
    onClose: () => void
}

const JiaoFenQueRenModal: React.FC<JiaoFenQueRenModalProps> = ({ visible, onJiaoFeiQueRen, onClose }) => {
    const [selectedValue, setSelectedValue] = useState<string>("");

    const onChange = (e: RadioChangeEvent) => {
        const value: string = e.target.value;
        setSelectedValue(value);
    }

    return (
        <>
            <Modal
                visible={visible}
                title="缴费确认"
                onCancel={onClose}
                footer={false}
                closeIcon={<CloseCircleOutlined />}
            >
                <Space direction="vertical" style={{ width: "100%" }} size={30}>
                    <Row>
                        <span style={{ fontWeight: 'bold' }}>请确认是否已经收到了学员的缴费金额？</span>
                    </Row>
                    <Row justify="center">
                        <Radio.Group onChange={onChange}>
                            <Space direction="vertical">
                                <Radio value={"QUAN_BU_YI_JIAO"}>全部已缴</Radio>
                                <Radio value={"BU_FEN_JIAO_FEI"}>部分已缴</Radio>
                                <Radio value={"WEI_JIAO_FEI"}>未缴费</Radio>
                            </Space>
                        </Radio.Group>
                    </Row>
                    <Row justify="end">
                        <Row gutter={10}>
                            <Col>
                                <Button onClick={onClose}>
                                    取消
                                </Button>
                            </Col>
                            <Col>
                                <Button onClick={e => onJiaoFeiQueRen(selectedValue)} type="primary">
                                    确定
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                </Space>
            </Modal>
        </>
    )
}

export default JiaoFenQueRenModal
