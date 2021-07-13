import React, { useState, useRef } from 'react'
import { Moment } from 'moment'
import { ActionType } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Form, Space, Row, Col, TimePicker } from 'antd'
import { EditableProTable } from '@ant-design/pro-table';

/**
 * 排课【每周重复】组件
 * @returns 
 */

export type PaiKeChongFuShiJian = {
    id?: React.Key,
    day?: string,
    startTime?: Moment,
    stopTime?: Moment
}

export type PaiKeZhouChongFuProps = {
    onSetPaiKeChongFuShiJian: (chongFuShiJian: PaiKeChongFuShiJian[]) => void
}

const PaiKeZhouChongFu: React.FC<PaiKeZhouChongFuProps> = ({ onSetPaiKeChongFuShiJian }) => {
    const actionRef = useRef<ActionType>();
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [list, setList] = useState<PaiKeChongFuShiJian[]>([]);

    const columns: ProColumns<PaiKeChongFuShiJian>[] = [
        {
            title: '星期',
            dataIndex: 'day',
            valueType: "select",
            valueEnum: {
                ONE: { text: '星期一' },
                TWO: { text: '星期二' },
                THREE: { text: '星期三' },
                FOUR: { text: '星期四' },
                FIVE: { text: '星期五' },
                SIX: { text: '星期六' },
                SEVEN: { text: '星期日' }
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            width: '55%',
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            valueType: "time",
            renderFormItem: () => <TimePicker format="HH:mm" placeholder="开始时间" />,
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
            title: '结束时间',
            dataIndex: 'stopTime',
            valueType: "time",
            renderFormItem: () => <TimePicker format="HH:mm" placeholder="结束时间" />,
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
            valueType: "option",
            width: 50,
            render: () => {
                return null;
            },
        },
    ];

    /** 正在编辑的列修改的时候 */
    const handleOnChange = (values: PaiKeChongFuShiJian[]) => {
        setList(values);
    }

    /** 正在编辑的列修改的时候 */
    const handleValuesChange = (record: PaiKeChongFuShiJian, dataSource: PaiKeChongFuShiJian[]) => {
        setList(dataSource);
        let hasEmpty = false;
        dataSource.forEach(d => {
            if (!d.day || !d.startTime || !d.stopTime) {
                hasEmpty = true;
                return;
            }
        });
        if (hasEmpty) {
            onSetPaiKeChongFuShiJian([]);
        } else {
            onSetPaiKeChongFuShiJian(dataSource);
        }
    }

    return (
        <>
            <Space direction="vertical" size="large">
                <Row>
                    <Col offset={4}>
                        <EditableProTable<PaiKeChongFuShiJian>
                            rowKey="id"
                            actionRef={actionRef}
                            columns={columns}
                            value={list}
                            onChange={handleOnChange}
                            recordCreatorProps={{
                                newRecordType: "dataSource",
                                record: () => ({ id: Date.now() })
                            }}
                            editable={{
                                type: "multiple",
                                editableKeys,
                                actionRender: (row, config, defaultDoms) => {
                                    return [defaultDoms.delete];
                                },
                                onChange: setEditableRowKeys,
                                onValuesChange: handleValuesChange,
                            }}
                        />
                    </Col>
                </Row>
            </Space>
        </>
    )
}

export default PaiKeZhouChongFu
