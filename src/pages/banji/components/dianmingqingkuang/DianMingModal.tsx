import React, { useState, useEffect } from 'react'
import { Form, Modal, Row, Col, DatePicker, Select, TimePicker, Input, Button, Space, TableColumnType, Table, Radio, RadioChangeEvent, InputNumber } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { BanJiView, LaoShi, PaiKeJiLu, ShangKeJiaoShi, ShanKeXueYuan, XueYuanDaoKeZhuangTai } from '../../../../customtypes'
import { action, makeObservable, observable, toJS } from 'mobx'
import { huoQuLaoShiAll } from '../../../../services/laoshi'
import { huoQuShangKeJiaoShiAll } from '../../../../services/common'
import moment, { Moment } from 'moment'
import { convertShangKeXueYuanLeiXing2Text } from '../../../../utils/converter'
import { useForm } from 'antd/lib/form/Form'
import { observer } from 'mobx-react'
import { paiKeJiLuDianMing } from '../../../../services/combine'

const { Option } = Select;

type DianMingModalProps = {
    banJiXiangQing: BanJiView | undefined
    visible: boolean
    paiKeJiLu: PaiKeJiLu | undefined
    onClose: () => void
    refreshJiLuList: () => void
}

// form表单数据类型
type DianMingFormValueType = {
    // 上课日期
    shangKeRiQi: Moment
    // 上课老师Id
    shangKeLaoShiId: string
    // 上课教室Id
    shangKeJiaoShiId: string
    // 上课时间
    shangKeShiJian: Moment[]
    // 授课课时
    shouKeKeShi: number
    // 上课内容
    shangKeNeiRong: string
    // 上课学员组
    shangKeXueYuanZu: ShanKeXueYuan[]
    // 备注
    beiZhu: string
}

class DianMingModalStore {
    constructor(paiKeJiLu: PaiKeJiLu | undefined) {
        // 初始化学员到课状态为【到课】
        if (paiKeJiLu && paiKeJiLu.shangKeXueYuanZu) {
            paiKeJiLu.shangKeXueYuanZu.forEach(v => { v.xueYuanDaoKeZhuangTai = XueYuanDaoKeZhuangTai.DAO_KE });
        }
        this.paiKeJiLu = paiKeJiLu;
        makeObservable(this);
    }

    @observable
    paiKeJiLu: PaiKeJiLu | undefined = undefined;

    /**
     * 更新排课记录
     * @param newPaiKeJiLu 新的排课记录
     */
    @action
    setUpdatedPaiKeJiLu = (newPaiKeJiLu: PaiKeJiLu) => {
        this.paiKeJiLu = newPaiKeJiLu;
    }
}

const DianMingModal: React.FC<DianMingModalProps> = ({ banJiXiangQing, visible, onClose, paiKeJiLu, refreshJiLuList }) => {
    // 复制一个父组件传过来的排课记录
    const newPaiKeJiLu: PaiKeJiLu | undefined = paiKeJiLu ? toJS(paiKeJiLu) : undefined;
    const [viewStore] = useState<DianMingModalStore>(new DianMingModalStore(newPaiKeJiLu));
    const [shangKeJiaoShiList, setShangKeJiaoShiList] = useState<ShangKeJiaoShi[]>([]);
    const [laoShiList, setLaoShiList] = useState<LaoShi[]>([]);

    const [form] = useForm();

    const paiKeJiLuData = viewStore.paiKeJiLu;

    // 获取老师列表
    useEffect(() => {
        const getLaoshi = async () => {
            try {
                const result = await huoQuLaoShiAll();
                setLaoShiList(result.list);
            } catch (e) { }
        }
        getLaoshi()
    }, [])

    // 获取上课教室
    useEffect(() => {
        const getShangKeJiaoShi = async () => {
            try {
                const result = await huoQuShangKeJiaoShiAll();
                setShangKeJiaoShiList(result.list);
            } catch (e) { }
        }
        getShangKeJiaoShi()
    }, [])

    // 完成点名Form表单提交
    const onFormFinish = async () => {
        const values: DianMingFormValueType = await form.validateFields();
        if (viewStore.paiKeJiLu) {
            // viewStore复制一份排课信息
            const paiKeJiLuDianMingResult: PaiKeJiLu = toJS(viewStore.paiKeJiLu);
            // 用form表单数据更新排课信息
            paiKeJiLuDianMingResult.shangKeRiQi = values.shangKeRiQi.valueOf();
            paiKeJiLuDianMingResult.shangKeLaoShiId = values.shangKeLaoShiId;
            paiKeJiLuDianMingResult.shangKeJiaoShiId = values.shangKeJiaoShiId;
            paiKeJiLuDianMingResult.shangKeShiJianStart = values.shangKeShiJian[0].valueOf();
            paiKeJiLuDianMingResult.shangKeShiJianEnd = values.shangKeShiJian[1].valueOf();
            paiKeJiLuDianMingResult.shouKeKeShi = values.shouKeKeShi;
            paiKeJiLuDianMingResult.shangKeNeiRong = values.shangKeNeiRong;
            // 更新上课学员信息（原有上课学员信息里的学员类型等信息保留）
            values.shangKeXueYuanZu.forEach(v => {
                paiKeJiLuDianMingResult.shangKeXueYuanZu.forEach(v1 => {
                    if (v.xueYuanId === v1.xueYuanId) {
                        v1.xueYuanDaoKeZhuangTai = v.xueYuanDaoKeZhuangTai
                        v1.beiZhu = v.beiZhu
                        v1.kouChuKeShi = v.kouChuKeShi
                    }
                })
            })

            try {
                await paiKeJiLuDianMing(paiKeJiLuDianMingResult);
                refreshJiLuList();
                onClose();
            } catch (e) { }

        }
    }

    // 授课课时输入框change
    const onShouKeKeShiChange = () => {
        // 获取并更新form表单数据
        const shouKeKeShi: number = form.getFieldValue("shouKeKeShi");
        const shanKeXueYuanZu: ShanKeXueYuan[] = form.getFieldValue("shangKeXueYuanZu");
        shanKeXueYuanZu.forEach(v => {
            if (v.xueYuanDaoKeZhuangTai === XueYuanDaoKeZhuangTai.DAO_KE || v.xueYuanDaoKeZhuangTai === XueYuanDaoKeZhuangTai.CHI_DAO) {
                v.kouChuKeShi = shouKeKeShi;
            }
        })

        if (viewStore.paiKeJiLu) {
            const newPaiKeJiLuStoreValue: PaiKeJiLu = toJS(viewStore.paiKeJiLu);
            newPaiKeJiLuStoreValue.shouKeKeShi = shouKeKeShi;
            newPaiKeJiLuStoreValue.shangKeXueYuanZu.forEach(v => {
                if (v.xueYuanDaoKeZhuangTai === XueYuanDaoKeZhuangTai.DAO_KE || v.xueYuanDaoKeZhuangTai === XueYuanDaoKeZhuangTai.CHI_DAO) {
                    v.kouChuKeShi = shouKeKeShi;
                }
            })
            viewStore.setUpdatedPaiKeJiLu(newPaiKeJiLuStoreValue);
        }
    }

    // 到课状态change
    const onDaiKeZhuangTaiChange = (e: RadioChangeEvent, record: ShanKeXueYuan) => {
        const newDaoKeZhuangTai: XueYuanDaoKeZhuangTai = e.target.value;

        // 获取并更新form表单数据
        const shouKeKeShi: number = form.getFieldValue("shouKeKeShi");
        const shanKeXueYuanZu: ShanKeXueYuan[] = form.getFieldValue("shangKeXueYuanZu");
        shanKeXueYuanZu.forEach(v => {
            if (v.xueYuanId === record.xueYuanId) {
                v.xueYuanDaoKeZhuangTai = newDaoKeZhuangTai;
                if (newDaoKeZhuangTai === XueYuanDaoKeZhuangTai.QING_JIA) {
                    if (!banJiXiangQing?.qingJiaKouKeShi) {
                        v.kouChuKeShi = 0
                    } else {
                        v.kouChuKeShi = shouKeKeShi
                    }
                } else if (newDaoKeZhuangTai === XueYuanDaoKeZhuangTai.WEI_DAO) {
                    if (!banJiXiangQing?.weiDaoKouKeShi) {
                        v.kouChuKeShi = 0
                    } else {
                        v.kouChuKeShi = shouKeKeShi
                    }
                } else {
                    v.kouChuKeShi = shouKeKeShi
                }
            }
        })

        // 更新排课信息viewStore
        if (viewStore.paiKeJiLu) {
            const newPaiKeJiLuStoreValue: PaiKeJiLu = toJS(viewStore.paiKeJiLu);
            newPaiKeJiLuStoreValue.shangKeXueYuanZu.forEach(v => {
                if (v.xueYuanId === record.xueYuanId) {
                    v.xueYuanDaoKeZhuangTai = newDaoKeZhuangTai;
                    if (newDaoKeZhuangTai === XueYuanDaoKeZhuangTai.QING_JIA) {
                        if (!banJiXiangQing?.qingJiaKouKeShi) {
                            v.kouChuKeShi = 0
                        } else {
                            v.kouChuKeShi = shouKeKeShi
                        }
                    } else if (newDaoKeZhuangTai === XueYuanDaoKeZhuangTai.WEI_DAO) {
                        if (!banJiXiangQing?.weiDaoKouKeShi) {
                            v.kouChuKeShi = 0
                        } else {
                            v.kouChuKeShi = shouKeKeShi
                        }
                    } else {
                        v.kouChuKeShi = shouKeKeShi
                    }
                }
            })
            viewStore.setUpdatedPaiKeJiLu(newPaiKeJiLuStoreValue);
        }
    }

    const columns: TableColumnType<ShanKeXueYuan>[] = [
        {
            title: '姓名',
            dataIndex: 'xueYuanId',
            key: 'xueYuanId',
            render: (value, record, index) => {
                const xueYuanLeiXing = convertShangKeXueYuanLeiXing2Text(record.shangKeXueYuanLeiXing);
                return <>
                    <Form.Item
                        name={["shangKeXueYuanZu", index, "xueYuanId"]}
                        initialValue={record.xueYuanId}
                        style={{ marginBottom: 0 }}>
                        <>{record.xueYuanXingMing} {xueYuanLeiXing ? `(${xueYuanLeiXing})` : ""}</>
                    </Form.Item>

                </>
            }
        },
        {
            title: '手机号',
            dataIndex: 'shouJi',
            key: 'shouJi',
            render: (value, record) => {
                return <>
                    {record.shouJi}
                </>
            }
        },
        {
            title: '剩余课时',
            dataIndex: 'shengYuKeShi',
            key: 'shengYuKeShi',
            render: (value, record) => {
                return <>
                    {record.shengYuKeShi || 0}课时
                </>
            }
        },
        {
            title: '到课状态',
            dataIndex: 'xueYuanDaoKeZhuangTai',
            key: 'xueYuanDaoKeZhuangTai',
            render: (value, record, index) => {
                return (
                    <Form.Item
                        name={["shangKeXueYuanZu", index, "xueYuanDaoKeZhuangTai"]}
                        initialValue={XueYuanDaoKeZhuangTai.DAO_KE}
                        style={{ marginBottom: 0 }}
                    >
                        <Radio.Group onChange={e => onDaiKeZhuangTaiChange(e, record)}>
                            <Radio.Button value={XueYuanDaoKeZhuangTai.DAO_KE} >
                                到课
                            </Radio.Button>
                            <Radio.Button value={XueYuanDaoKeZhuangTai.CHI_DAO}>
                                迟到
                            </Radio.Button>
                            <Radio.Button value={XueYuanDaoKeZhuangTai.QING_JIA}>
                                请假
                            </Radio.Button>
                            <Radio.Button value={XueYuanDaoKeZhuangTai.WEI_DAO}>
                                未到
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                );
            }
        },
        {
            title: '扣课时',
            dataIndex: 'kouChuKeShi',
            key: 'kouChuKeShi',

            render: (text, record, index) => {
                return (
                    <Form.Item
                        name={["shangKeXueYuanZu", index, "kouChuKeShi"]}
                        initialValue={record.kouChuKeShi || paiKeJiLuData?.shouKeKeShi}
                        rules={[{ required: true, message: "请填写扣除课时" }]}
                        style={{ marginBottom: 0 }}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                );
            }
        },
        {
            title: '备注',
            dataIndex: 'beiZhu',
            key: 'beiZhu',
            render: (text, record, index) => {
                return (
                    <Form.Item
                        name={["shangKeXueYuanZu", index, "beiZhu"]}
                        initialValue={record.beiZhu}
                        style={{ marginBottom: 0 }}>
                        <Input type="text" />
                    </Form.Item>
                );
            }
        }
    ]

    return (
        <>
            <Modal
                visible={visible}
                title="班级点名"
                width={'70rem'}
                onCancel={onClose}
                footer={false}
                closeIcon={<CloseCircleOutlined />}
            >
                <Form
                    form={form}
                    onFinish={onFormFinish}
                >
                    <Row justify="space-between">
                        <Col span={7}>
                            <Form.Item
                                labelAlign="left" labelCol={{ span: 8 }} label="上课日期"
                                name="shangKeRiQi"
                                rules={[{ required: true, message: "请选择上课日期" }]}
                                initialValue={paiKeJiLuData?.shangKeRiQi ? moment(Number(paiKeJiLuData?.shangKeRiQi)) : ""}
                            >
                                <DatePicker />
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item
                                labelAlign="left" labelCol={{ span: 8 }} name="shangKeLaoShiId" label="上课老师"
                                rules={[{ required: true, message: "请选择上课老师" }]}
                                initialValue={paiKeJiLuData?.shangKeLaoShiId}
                            >
                                <Select>
                                    {laoShiList?.map(k => {
                                        return (
                                            <Option key={k.id} value={k.id || ""}>{k.xingMing}</Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item
                                labelAlign="left"
                                labelCol={{ span: 8 }}
                                name="shangKeJiaoShiId"
                                label="上课教室"
                                rules={[{ required: true, message: "请选择上课教室" }]}
                                initialValue={paiKeJiLuData?.shangKeJiaoShiId}
                            >
                                <Select>
                                    {shangKeJiaoShiList?.map(k => {
                                        return (
                                            <Option key={k.id} value={k.id || ""}>{k.mingCheng}</Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between">
                        <Col span={7}>
                            <Form.Item
                                labelAlign="left" labelCol={{ span: 8 }} name="shangKeShiJian" label="上课时间"
                                rules={[{ required: true, message: "请选择上课时间" }]}
                                initialValue={[
                                    paiKeJiLuData?.shangKeShiJianStart ? moment(Number(paiKeJiLuData?.shangKeShiJianStart)) : "",
                                    paiKeJiLuData?.shangKeShiJianEnd ? moment(Number(paiKeJiLuData?.shangKeShiJianEnd)) : "",
                                ]}
                            >
                                <TimePicker.RangePicker format="HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item
                                labelAlign="left" labelCol={{ span: 8 }} name="shouKeKeShi" label="授课课时"
                                rules={[{ required: true, message: "请输入授课课时" }]}
                                initialValue={paiKeJiLuData?.shouKeKeShi}
                            >
                                <InputNumber onChange={onShouKeKeShiChange} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item
                                labelAlign="left" labelCol={{ span: 8 }} name="shangKeNeiRong" label="上课内容"
                                initialValue={paiKeJiLuData?.shangKeNeiRong}
                            >
                                <Input type="text" maxLength={20} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Space size="large" direction="vertical" style={{ width: '100%' }}>
                        <Row>
                            <Space size="middle">
                                <Button disabled>+添加临时学员</Button>
                                <Button disabled>+添加补课学员</Button>
                            </Space>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table
                                    bordered={true}
                                    dataSource={paiKeJiLuData?.shangKeXueYuanZu}
                                    columns={columns}
                                    pagination={false}
                                >
                                </Table>
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col span={24}>
                                <Row justify="end">
                                    <Form.Item>
                                        <Row gutter={20}>
                                            <Col>
                                                <Button onClick={onClose}>
                                                    取消
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button type="primary" htmlType="submit">
                                                    完成点名
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Row>
                            </Col>
                        </Row>
                    </Space>
                </Form>
            </Modal>
        </>
    )
}

export default observer(DianMingModal);
