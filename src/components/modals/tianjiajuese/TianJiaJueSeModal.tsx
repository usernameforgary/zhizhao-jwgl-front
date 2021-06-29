import { Modal, Button, Form, Input, message, Tree, Row, Col } from 'antd';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { JueSe, OrderableDataNode } from '../../../customtypes';
import { chuangJianJueSe } from '../../../services/juese';
import { huoQuXiTongCaiDanLieBiao } from '../../../services/xintongcaidan';
import { randomId } from '../../../utils';
import { convertCaiDanList2TreeData } from '../../../utils/converter';
import { JueseGroupData } from '../../juesecheckbox/JueseCheckboxGroup';
import FormTree from './FormTree';

export type TianJiaJueSeModalProps = {
    modalTitle?: string
    id?: string
    visible: boolean,
    onClose: () => void,
    addNew?: (item: JueseGroupData) => void
}

const TianJiaJueSeModal: React.FC<TianJiaJueSeModalProps> = ({ id, modalTitle, visible, onClose, addNew }: TianJiaJueSeModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [treeData, setTreeData] = useState<OrderableDataNode[]>([]);

    useEffect(() => {
        huoQuXiTongCaiDan();
    }, [])

    // 获取系统菜单
    const huoQuXiTongCaiDan = async () => {
        try {
            const result = await huoQuXiTongCaiDanLieBiao();
            const treeData = convertCaiDanList2TreeData(result);
            console.log(treeData);
            setTreeData(treeData);
        } catch (error) {
            message.error(error.message || error.toString())
        }
    }

    // 创建角色
    const jueSeChuangJian = async (jueSe: JueSe): Promise<void> => {
        const id = await chuangJianJueSe(jueSe.mingCheng, jueSe.jianJie ?? '', jueSe.xiTongCaiDanZu);
        if (addNew) {
            const newJueSe: JueseGroupData = {
                val: id,
                mingCheng: jueSe.mingCheng,
                jianJie: jueSe.jianJie || ""
            }

            addNew(newJueSe);
        }
        onClose();
    }

    const onFormFinish = (values: any) => {
        const id = randomId();
        const mingCheng: string = values.mingCheng;
        const jianJie: string = values.jianJie || "";
        const xiTongCaiDanZu: number[] = values.xiTongCaiDanZu || []
        const jueSe: JueSe = { id, mingCheng, jianJie, xiTongCaiDanZu }
        jueSeChuangJian(jueSe);
    }

    return (
        <Modal
            visible={visible}
            title={modalTitle ?? "添加角色"}
            onCancel={onClose}
            footer={false}
        >
            <Form
                onFinish={onFormFinish}
            >
                <Row>
                    <Col span={18}>
                        <Form.Item labelAlign="left" labelCol={{ span: 6 }} name="mingCheng" label="名称" rules={[{ required: true, message: "输入角色名称" }]}>
                            <Input></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={18}>
                        <Form.Item labelAlign="left" labelCol={{ span: 6 }} name="jianJie" label="简介">
                            <Input.TextArea></Input.TextArea>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={18}>
                        <Form.Item labelAlign="left" labelCol={{ span: 6 }} name="xiTongCaiDanZu" label="角色权限" rules={[{ required: true, message: "勾选以分配权限" }]}>
                            <FormTree treeData={treeData} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="end">
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

export default observer(TianJiaJueSeModal)
