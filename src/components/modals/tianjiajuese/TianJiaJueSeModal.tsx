import { Modal, Button, Form, Input } from 'antd';
import React from 'react';
import { useState } from 'react';
export type TianJiaJueSeModalProps = {
    modalTitle?: string
    id?: string
    visible: boolean,
    onClose: () => void
}

const TianJiaJueSeModal: React.FC<TianJiaJueSeModalProps> = ({ id, modalTitle, visible, onClose }: TianJiaJueSeModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const handleOk = () => {

    }
    const onCancel = () => {
        onClose();
    }
    return (
        <Modal
            visible={visible}
            title={modalTitle ?? "添加角色"}
            onOk={handleOk}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onClose}>
                    取消
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                    保存
                </Button>,
            ]}
        >
            <Form>
                <Form.Item name="mingCheng" label="名称" rules={[{ required: true, message: "输入角色名称" }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="jianJie" label="简介">
                    <Input.TextArea></Input.TextArea>
                </Form.Item>
                <Form.Item name="xiXongCaiDanLieBiao" label="角色权限" rules={[{ required: true, message: "勾选以分配权限" }]}>

                </Form.Item>
            </Form>
        </Modal>
    )
}

export default TianJiaJueSeModal
