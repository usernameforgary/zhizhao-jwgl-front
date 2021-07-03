import { TableColumnType, Table, Row, Form, Input, Button } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import React, { ChangeEvent, useState } from 'react'
import { DingJiaBiaoZhun } from '../../../customtypes';


export type DingJiaBiaoZhunProps = {
    parentFormFieldName: string,
    form: FormInstance,
    dingJiaBiaoZhunDatas: DingJiaBiaoZhun[] | [],
}

const DingJianBiaoZhunForm: React.FC<DingJiaBiaoZhunProps> = ({ parentFormFieldName, form, dingJiaBiaoZhunDatas }) => {

    const [datas, setDatas] = useState<DingJiaBiaoZhun[] | []>(dingJiaBiaoZhunDatas);

    const columns: TableColumnType<DingJiaBiaoZhun>[] = [
        {
            title: '名称',
            dataIndex: "mingCheng",
            key: 'mingCheng',
            render: (text, record, index) => {
                return (
                    <Form.Item
                        initialValue={text}
                        name={[parentFormFieldName, index, "mingCheng"]}
                        hasFeedback
                        rules={[{ required: true, message: "请输入课时名称" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const dingJiaBiaoZhunZu: DingJiaBiaoZhun[] = getFieldValue([parentFormFieldName]);
                                const otherDingJian: DingJiaBiaoZhun[] = [...dingJiaBiaoZhunZu];
                                otherDingJian.splice(index);
                                let nameExist = false;
                                otherDingJian.forEach(v => {
                                    if (v.mingCheng === value) {
                                        nameExist = true;
                                        return;
                                    }
                                })
                                if (nameExist) {
                                    return Promise.reject(new Error('名称已存在'));
                                }
                                return Promise.resolve();
                            },
                        })]}
                        style={{ marginBottom: 0 }}>
                        <Input></Input>
                    </Form.Item>
                );
            }
        },
        {
            title: '课时数量',
            dataIndex: 'keShi',
            key: 'keShi',
            render: (text, record, index) => {
                return (
                    <Form.Item initialValue={text}
                        rules={[{ required: true, message: "请输入课时数量" }]}
                        name={[parentFormFieldName, index, "keShi"]}
                        style={{ marginBottom: 0 }}>
                        <Input type="number" onChange={e => onKeShiChangeOrZongJiaChange(e, index)} min={0}></Input>
                    </Form.Item>
                );
            }
        },
        {
            title: '总价（元）',
            dataIndex: 'zongJia',
            key: 'zongJia',
            render: (text, record, index) => {
                return (
                    <Form.Item initialValue={text} rules={[{ required: true, message: "请输入总价" }]} name={[parentFormFieldName, index, "zongJia"]} style={{ marginBottom: 0 }}>
                        <Input type="number" onChange={e => onKeShiChangeOrZongJiaChange(e, index)} min={0}></Input>
                    </Form.Item>
                );
            }
        },
        {
            title: '单价（元）',
            dataIndex: 'keChengDanJia',
            key: 'keChengDanJia',
            render: (text, record, index) => {
                return (
                    <Form.Item
                        initialValue={text}
                        rules={[{ required: true, message: "请输入单价" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const dingJiaBiaoZhunZu: DingJiaBiaoZhun[] = getFieldValue([parentFormFieldName]);
                                const selectedDingJiaBiaoZhun = dingJiaBiaoZhunZu[index];
                                const danJia = selectedDingJiaBiaoZhun.keChengDanJia;
                                const zongJia = selectedDingJiaBiaoZhun.zongJia;
                                const shuLiang = selectedDingJiaBiaoZhun.keShi;
                                if ((shuLiang > 0) && (danJia < zongJia / shuLiang)) {
                                    return Promise.reject(new Error('单价应不小于[总价/课时数量]'));
                                }
                                return Promise.resolve();
                            },
                        })]}
                        name={[parentFormFieldName, index, "keChengDanJia"]}
                        style={{ marginBottom: 0 }}
                    >
                        <Input type="number" min={0}></Input>
                    </Form.Item>
                );
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (value, record) => (
                <>
                    <Button type="link" onClick={() => removeItem(record.key)}>删除</Button>
                </>
            ),
        },
    ];

    // 添加元素
    const addNewItem = () => {
        const newData: DingJiaBiaoZhun = { key: datas.length, mingCheng: "", keShi: 0, zongJia: 0, keChengDanJia: 0 }
        setDatas([...datas, newData]);
    }

    // 移除元素
    const removeItem = (index: number) => {
        const currDingJiaBiaoZhun: DingJiaBiaoZhun[] = form.getFieldValue([parentFormFieldName]);
        const newValues: DingJiaBiaoZhun[] = [...currDingJiaBiaoZhun];
        newValues.splice(index, 1);
        form.setFieldsValue({ [parentFormFieldName]: newValues })
        const newDatas = datas.filter(d => d.key !== index);
        // 防止react key重复，需重新生成
        newDatas.forEach((v, idx) => {
            v.key = idx;
        })
        setDatas(newDatas);
    }

    // 课时或总价输入框change事件handler
    const onKeShiChangeOrZongJiaChange = (e: ChangeEvent, index: number) => {
        const currDingJiaBiaoZhun: DingJiaBiaoZhun = form.getFieldValue([parentFormFieldName, index]);
        const zongJia: number = currDingJiaBiaoZhun.zongJia;
        const shuLiang: number = currDingJiaBiaoZhun.keShi;
        if (shuLiang && shuLiang > 0) {
            const newDanJia: number = Math.ceil(zongJia / shuLiang);
            currDingJiaBiaoZhun.keChengDanJia = newDanJia;
        }
    }

    return (
        <>
            <Table
                bordered={true}
                dataSource={datas}
                columns={columns}
                pagination={false}
                footer={(currentPageData) => {
                    return (
                        <Row justify="center">
                            {currentPageData.length < 10 ? (
                                <Button type="link" onClick={addNewItem} style={{ color: "#02AEF8" }}>+添加（{currentPageData.length}/10）</Button>

                            ) : (
                                <Button type="text" style={{ color: "gray" }}>+添加（{currentPageData.length}/10）</Button>
                            )}
                        </Row>
                    );
                }}
            >
            </Table>
        </>
    )
}

export default DingJianBiaoZhunForm
