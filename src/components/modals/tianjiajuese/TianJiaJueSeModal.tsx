import { Modal, Button, Form, Input, message, Tree, Row, Col } from 'antd';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { JueSe, OrderableDataNode } from '../../../customtypes';
import { chuangJianJueSe } from '../../../services/juese';
import { huoQuXiTongCaiDanLieBiao } from '../../../services/xintongcaidan';
import { randomId } from '../../../utils';
import { convertCaiDanList2TreeData } from '../../../utils/converter';
import FormTree from './FormTree';

export type TianJiaJueSeModalProps = {
    modalTitle?: string
    id?: string
    visible: boolean,
    onClose: () => void
}

const TianJiaJueSeModal: React.FC<TianJiaJueSeModalProps> = ({ id, modalTitle, visible, onClose }: TianJiaJueSeModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [treeData, setTreeData] = useState<OrderableDataNode[]>([]);

    useEffect(() => {
        huoQuXiTongCaiDan();
    }, [])

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

    const jueSeChuangJian = async (jueSe: JueSe) => {
        await chuangJianJueSe(jueSe.mingCheng, jueSe.jianJie ?? '', jueSe.xiTongCaiDanZu);
    }

    const onFormFinish = (values: any) => {
        console.log(values);
        const id = randomId();
        // const mingCheng: string = values.mingCheng;
        // const jianJie: string = values.jianJie || "";
        // const xiTongCaiDanZu: number[] = values.xiTongCaiDanZu || []
        // const jueSe: JueSe = { id, mingCheng, jianJie, xiTongCaiDanZu }
        // jueSeChuangJian(jueSe);
    }

    return (
        <Modal
            visible={visible}
            title={modalTitle ?? "添加角色"}
            onCancel={onClose}
            footer={false}
        >
            <Form
                onFinish={onFormFinish}>
                <Form.Item name="mingCheng" label="名称" rules={[{ required: true, message: "输入角色名称" }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="jianJie" label="简介">
                    <Input.TextArea></Input.TextArea>
                </Form.Item>
                <Form.Item name="xiTongCaiDanZu" label="角色权限" rules={[{ required: true, message: "勾选以分配权限" }]}>
                    <FormTree treeData={treeData} />
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

export default observer(TianJiaJueSeModal)
