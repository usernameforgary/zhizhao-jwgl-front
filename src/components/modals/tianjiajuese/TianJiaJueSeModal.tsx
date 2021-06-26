import { Modal, Button, Form, Input, message, Tree, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { DataNode } from 'antd/lib/tree';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { NoPageSearchResult, XiTongCaiDan } from '../../../customtypes';
import { huoQuXiTongCaiDanLieBiao } from '../../../services/xintongcaidan';

export type TianJiaJueSeModalProps = {
    modalTitle?: string
    id?: string
    visible: boolean,
    onClose: () => void
}
export interface OrderDataNode extends DataNode {
    paiXu: number | 0,
    children?: OrderDataNode[]
}

const TianJiaJueSeModal: React.FC<TianJiaJueSeModalProps> = ({ id, modalTitle, visible, onClose }: TianJiaJueSeModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [treeData, setTreeData] = useState<OrderDataNode[]>([]);

    const convertCaiDanList2TreeData = (data: NoPageSearchResult<XiTongCaiDan>): OrderDataNode[] => {
        //TODO 目前仅支持2级菜单的处理
        const parentNodes: OrderDataNode[] = [];
        // 取得所有父节点
        data.list.map(val => {
            if (!val.isYeZi && !val.yinCang) {
                const parentNode: OrderDataNode = { key: val.id ?? 0, title: val.mingCheng, paiXu: val.paiXu, isLeaf: false, children: [] }
                parentNodes.push(parentNode);
            }
        });

        //父节点排序
        parentNodes.sort((a, b) => (a.paiXu > b.paiXu) ? 1 : ((b.paiXu > a.paiXu) ? -1 : 0));
        //插入子节点
        data.list.map(val => {
            if (val.isYeZi && !val.yinCang) {
                const childNode: OrderDataNode = { key: val.id ?? 0, title: val.mingCheng, isLeaf: true, paiXu: val.paiXu };
                parentNodes.map((p, idx) => {
                    if (p.key === val.fuId) {
                        parentNodes[idx].children?.push(childNode);
                    }
                })
            }
        })
        //子节点排序
        parentNodes.map(p => {
            if (p.children) {
                p.children.sort((a, b) => (a.paiXu > b.paiXu) ? 1 : ((b.paiXu > a.paiXu) ? -1 : 0));
            }
        })

        return parentNodes;
    }

    const huoQuXiTongCaiDan = async () => {
        try {
            const result = await huoQuXiTongCaiDanLieBiao();
            const treeData = convertCaiDanList2TreeData(result);
            setTreeData(treeData);
        } catch (error) {
            message.error(error.message || error.toString())
        }
    }

    const handleOk = () => {
    }

    const onCancel = () => {
        onClose();
    }

    useEffect(() => {
        huoQuXiTongCaiDan();
    }, [])

    const onFormFinish = (values: any) => {
        console.log(values)
    }

    return (
        <Modal
            visible={visible}
            title={modalTitle ?? "添加角色"}
            onCancel={onCancel}
            footer={false}
        >
            <Form
                form={form}
                onFinish={onFormFinish}>
                <Form.Item name="mingCheng" label="名称" rules={[{ required: true, message: "输入角色名称" }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="jianJie" label="简介">
                    <Input.TextArea></Input.TextArea>
                </Form.Item>
                <Form.Item name="xiXongCaiDanLieBiao" label="角色权限" rules={[{ required: true, message: "勾选以分配权限" }]}>
                    <Tree
                        checkable
                        treeData={treeData}
                        selectedKeys={["0-1-0-0"]}
                    >
                        <Row>
                            {treeData.map(data => {
                                if (!data.isLeaf) {

                                }
                            })}
                        </Row>
                    </Tree>
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
        </Modal>
    )
}

export default observer(TianJiaJueSeModal)
