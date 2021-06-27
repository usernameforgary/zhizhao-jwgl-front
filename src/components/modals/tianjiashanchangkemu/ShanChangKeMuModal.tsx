import { Modal, Form, Input, Button } from 'antd';
import React from 'react';

type ShanChangKeMuModalProps = {
    visible: boolean
    onClose: () => void
}
const ShanChangKeMuModal: React.FC<ShanChangKeMuModalProps> = ({ visible, onClose }: ShanChangKeMuModalProps) => {
    const onFormFinish = (values: any) => {
        console.log(values);
    }

    return (
        <Modal
            visible={visible}
            title={"编辑擅长科目"}
            onCancel={onClose}
            footer={false}
        >
            <Form
                onFinish={onFormFinish}>
                <Form.Item name="mingCheng" label="名称" rules={[{ required: true, message: "输入擅长科目名" }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button onClick={onClose}>
                        取消
                    </Button>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </Modal >
    )
}

export default ShanChangKeMuModal
