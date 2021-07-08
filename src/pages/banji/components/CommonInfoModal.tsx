import { ActionType } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, Modal, Row, Form, Space } from 'antd';
import React from 'react';
import { useRef } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { useState } from 'react';
import { CommonType } from '../../../customtypes';

export type CommonInfoModalProps<T extends CommonType> = {
    visible: boolean
    modalTitle: string
    onClose: () => void
    list: T[],
    onNew: (mingCheng: string) => Promise<number | undefined>
    onUpdate: (item: T) => Promise<void>
}

function CommonInfoModal<T extends CommonType>({ visible, modalTitle, onClose, list, onNew, onUpdate }: CommonInfoModalProps<T>) {
    const actionRef = useRef<ActionType>();
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [form] = Form.useForm();

    const columns: ProColumns<T>[] = [
        {
            title: '名称',
            dataIndex: 'mingCheng',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            width: '60%',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id || "");
                    }}
                >
                    编辑
                </a>
            ],
        },
    ];

    const onRowSave = async (key: React.Key | React.Key[], value: T & { index?: number | undefined; }): Promise<void> => {
        console.log("key is: ", key, " index is: ", value.index)
        console.log("key is: ", key, value)
        if (key === 9999) {
            // 新增
            onNew(value.mingCheng);
        } else {
            onUpdate(value);
        }
    }

    const onRowDelete = async (key: React.Key | React.Key[], value: T): Promise<void> => {
        value.isDeleted = true;
        onUpdate(value);
    }

    return (
        <>
            <Modal
                visible={visible}
                title={modalTitle ?? "新增班级"}
                onCancel={onClose}
                footer={false}
            >
                <Space direction="vertical" size="large">
                    <Row>
                        <Button type="primary" onClick={() => {
                            actionRef.current?.addEditRecord?.({
                                id: 9999,
                                mingCheng: ""
                            })
                        }}>添加</Button>
                    </Row>
                    <Row>
                        <EditableProTable<T>
                            rowKey="id"
                            actionRef={actionRef}
                            // 关闭默认的新建按钮
                            recordCreatorProps={false}
                            columns={columns}
                            value={list}
                            editable={{
                                form,
                                editableKeys,
                                onSave: onRowSave,
                                onDelete: onRowDelete,
                                onChange: setEditableRowKeys,
                            }}
                        />
                    </Row>
                </Space>
            </Modal >
        </>
    )
}

export default CommonInfoModal;
