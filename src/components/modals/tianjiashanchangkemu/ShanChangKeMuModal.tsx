import { Modal, Form, Input, Button, Row, Col } from 'antd';
import { values } from 'mobx';
import React from 'react';
import { useState } from 'react';
import { ShanChangKeMu } from '../../../customtypes';
import { chuangJianShanChangKeMu } from '../../../services/common';

import './shanchangkemu.css';

type ShanChangKeMuModalProps = {
    visible: boolean
    onClose: () => void
    existShanChangKeMu?: ShanChangKeMu[] | []
    addNew?: (val: ShanChangKeMu) => void
}

const ShanChangKeMuModal: React.FC<ShanChangKeMuModalProps> = ({ visible, onClose, existShanChangKeMu, addNew }: ShanChangKeMuModalProps) => {

    //新增
    const addNewItem = async (mingCheng: string) => {
        const id: string = await chuangJianShanChangKeMu(mingCheng);
        if (addNew) {
            const newItem: ShanChangKeMu = { id: id, mingCheng: mingCheng };
            addNew(newItem);
        }
    }

    // 表单提交
    const onFormFinish = (values: any) => {
        const { mingCheng } = values;
        if (mingCheng) {
            addNewItem(mingCheng);
        }
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
                <Row>
                    <Form.Item name="mingCheng" label="名称" rules={[{ required: true, message: "输入擅长科目名" }]}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">添加科目</Button>
                    </Form.Item>
                </Row>
                <Row gutter={[10, 10]}>
                    {
                        existShanChangKeMu?.map((val, idx) => {
                            return (
                                <Col key={idx}>
                                    <Button className={"button-item"}>{val.mingCheng}</Button>
                                </Col>
                            )
                        })
                    }
                </Row>
                <Row justify="end" style={{ marginTop: 20 }}>
                    <Form.Item>
                        <Row gutter={10}>
                            <Col>
                                <Button onClick={onClose}>
                                    取消
                                </Button>
                            </Col>
                            <Col>
                                <Button type="primary" htmlType="submit">
                                    保存
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Row>
            </Form>
        </Modal >
    )
}

export default ShanChangKeMuModal
