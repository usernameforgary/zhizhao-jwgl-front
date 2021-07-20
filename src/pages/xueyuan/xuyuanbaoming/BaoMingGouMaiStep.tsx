import React, { useEffect } from 'react'
import { Space, Row, Col, Button, Form, Table, TableColumnType, Select, Input, InputNumber } from 'antd'
import { KeCheng, KeChengLeiXing, XueYuanKeCheng, XueYuanKeChengZhuangTai, XueYuanXinXi, YouHuiLeiXing } from '../../../customtypes'
import { useState } from 'react'
import KeChengModal from './KeChengModal'
import { getWeiXuanZeKeChengByXueYuanId } from '../../../services/kecheng'
import { useForm } from 'antd/lib/form/Form'
import { randomId } from '../../../utils'

const { Option } = Select;


type BaoMingGouMaiStepProps = {
    onPreviousStep: () => void
    onNextStep: () => void
    xueYuanXinXi: XueYuanXinXi | undefined
    initialXueYuanKeChengList: XueYuanKeCheng[] | []
}

type BaoMingGouMaiFormType = {
    mingCheng: string
    dingJiaBiaoZhunMingCheng?: string
    danJia: number
    keChengShuLiang: number
    zengSongKeShi: number
    youHuiLeiXing: YouHuiLeiXing
    youHuiShuLiang: number
    beiZhu?: string
}

const BaoMingGouMaiStep: React.FC<BaoMingGouMaiStepProps> = ({ onPreviousStep, onNextStep, xueYuanXinXi, initialXueYuanKeChengList }) => {
    const [showKeChengModal, setShowKeChengModal] = useState<boolean>(false);
    // 已选择的学员课程，父组件提供默认值（从父组件的store里获取）
    const [selectedXueYuanKeCheng, setSelectedXueYuanKeCheng] = useState<XueYuanKeCheng[]>(initialXueYuanKeChengList);
    // 已选择的课程Id
    const [selectedKeCheng, setSelectedKeCheng] = useState<KeCheng[]>([]);

    const [form] = useForm();

    useEffect(() => {
        const keChengs: KeCheng[] = [];
        selectedXueYuanKeCheng.forEach(v => {
            if (v.keCheng.id) {
                keChengs.push(v.keCheng);
            }
        })
        setSelectedKeCheng(keChengs)
    }, [selectedXueYuanKeCheng])

    // 显示或隐藏【选择课程窗口】
    const onToggleShowKeChengModel = () => {
        setShowKeChengModal(!showKeChengModal);
    }

    // 【选择课程窗口】获取课程
    const onGetKeChengList = async (): Promise<KeCheng[]> => {
        const keChengList = await getWeiXuanZeKeChengByXueYuanId(xueYuanXinXi?.id || "");
        return keChengList.list;
    }

    // 课程选择改变
    const onSelectedKeChengChange = (selectedKeys: React.Key[], selectedKeCheng: KeCheng[]) => {
        //// 重置form表单数据
        const currDingJiaBiaoZhun = form.getFieldValue(["xueYuanKeChengZu"]);
        let newFormValus: any = [];

        let newXueYuanKeChengList: XueYuanKeCheng[] = [...selectedXueYuanKeCheng];

        // 去除不在当前选择课程里的学员课程
        newXueYuanKeChengList = newXueYuanKeChengList.filter((v, index) => {
            let found = false;
            selectedKeys.forEach(vv => {
                if (vv === v.keCheng.id) {
                    return found = true
                }
            })

            if (found && currDingJiaBiaoZhun) {
                newFormValus.push(currDingJiaBiaoZhun[index]);
            }
            return found;
        })

        // 重新设置form表单数据
        form.setFieldsValue({ ["xueYuanKeChengZu"]: newFormValus })

        selectedKeCheng.forEach((v) => {
            const found = newXueYuanKeChengList.find(vv => vv.keCheng.id === v.id);
            if (!found) {
                const newId = randomId();

                const newItem: XueYuanKeCheng = {
                    id: newId,
                    key: newId,
                    // 所属学员ID
                    xueYuanId: (xueYuanXinXi && xueYuanXinXi.id) || '',
                    //课程ID
                    keChengId: v.id || '',
                    //课程信息
                    keCheng: v,
                    //定价标准
                    dingJiaBiaoZhun: v.dingJiaBiaoZhunZu && v.dingJiaBiaoZhunZu[0],
                    //课程状态
                    keChengZhuangTai: XueYuanKeChengZhuangTai.DAI_QUE_REN,
                    //课程类型
                    keChengLeiXing: KeChengLeiXing.XIN_BAO,
                    //单价
                    danJia: v.danJia,
                    //课程数量
                    keChengShuLiang: 0,
                    //原价
                    yuanJia: 0,
                    //赠送课时
                    zengSongKeShi: 0,
                    //优惠类型
                    youHuiLeiXing: YouHuiLeiXing.ZHI_JIAN,
                    //优惠数量
                    youHuiShuLiang: 0,
                    //签约金额
                    qianYueJinE: 0,
                    // 备注
                    beiZhu: ""
                }
                newXueYuanKeChengList = [...newXueYuanKeChengList, newItem];
            }
        })

        setSelectedXueYuanKeCheng(newXueYuanKeChengList);
    }

    // 删除学员课程
    const onRemoveXueYuanKeCheng = (xueYuanKeCheng: XueYuanKeCheng, index: number) => {
        // 重置form表单数据
        const currDingJiaBiaoZhun = form.getFieldValue(["xueYuanKeChengZu"]);
        const newValues = [...currDingJiaBiaoZhun];
        newValues.splice(index, 1);
        form.setFieldsValue({ ["xueYuanKeChengZu"]: newValues })

        setSelectedXueYuanKeCheng(selectedXueYuanKeCheng.filter(v => v.id !== xueYuanKeCheng.id));
        setSelectedKeCheng(selectedKeCheng.filter(v => v.id !== xueYuanKeCheng.keCheng.id));
    }

    const handleToPreviousStep = () => {
        onPreviousStep();
    }

    const handleToNextStep = async () => {
        await form.validateFields();
        //onNextStep();
    }

    const columns: TableColumnType<XueYuanKeCheng>[] = [
        {
            title: '课程名称',
            dataIndex: ["keCheng", "mingCheng"],
            key: 'keCheng.mingCheng',
            ellipsis: true,
            render: (text, record, index) => {
                return (
                    <>
                        <Row align="middle">
                            <Col>
                                <Form.Item
                                    initialValue={record.keChengLeiXing}
                                    name={["xueYuanKeChengZu", index, "keChengLeiXing"]}
                                    style={{ marginBottom: 0 }}>
                                    <Select>
                                        <Option key={KeChengLeiXing.XIN_BAO} value={KeChengLeiXing.XIN_BAO}>{"新报"}</Option>
                                        <Option key={KeChengLeiXing.KUO_KE} value={KeChengLeiXing.KUO_KE}>{"扩科"}</Option>
                                        <Option key={KeChengLeiXing.XU_BAO} value={KeChengLeiXing.XU_BAO}>{"续报"}</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <div>{text}</div>
                            </Col>
                        </Row>
                    </>
                );
            }
        },
        {
            title: '课程定价标准',
            dataIndex: 'dingJiaBiaoZhun',
            key: 'dingJiaBiaoZhun',

            render: (text, record, index) => {
                return (
                    <Form.Item
                        name={["xueYuanKeChengZu", index, "dingJiaBiaoZhunMingCheng"]}
                        // rules={[({ getFieldValue }) => ({
                        //     validator(_, value) {
                        //         const xueYuanKeChengChengFormData: BaoMingGouMaiFormType[] = getFieldValue(["xueYuanKeChengZu"]);
                        //         const currentFormData: BaoMingGouMaiFormType = xueYuanKeChengChengFormData[index];
                        //         console.log(currentFormData)
                        //         // const danJia = selectedDingJiaBiaoZhun.keChengDanJia;
                        //         // const zongJia = selectedDingJiaBiaoZhun.zongJia;
                        //         // const shuLiang = selectedDingJiaBiaoZhun.keShi;
                        //         // if ((shuLiang > 0) && (danJia < zongJia / shuLiang)) {
                        //         //     return Promise.reject(new Error('单价应不小于[总价/课时数量]'));
                        //         // }
                        //         return Promise.resolve();
                        //     },
                        // })]}
                        style={{ marginBottom: 0 }}>
                        <Select allowClear={true}>
                            {
                                record.keCheng.dingJiaBiaoZhunZu?.map((v) => {
                                    return <Option key={v.mingCheng} value={v.mingCheng}>{v.mingCheng}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                );
            }
        },
        {
            title: '课程单价',
            dataIndex: ['keCheng', 'danJia'],
            key: 'keCheng.danJia',
            render: (text, record, index) => {
                return (
                    <Form.Item initialValue={text}
                        rules={[{ required: true, message: "课程单价不能为空" }]}
                        name={["xueYuanKeChengZu", index, "danJia"]} style={{ marginBottom: 0 }}
                    >
                        <Input prefix="￥" suffix="/课时" type="number" min={1} />
                    </Form.Item>
                );
            }
        },
        {
            title: '购买数量',
            dataIndex: 'keChengShuLiang',
            key: 'keChengShuLiang',
            render: (text, record, index) => {
                return (
                    <Form.Item initialValue={text}
                        rules={[{ required: true, message: "购买数量不能为空" }]}
                        name={["xueYuanKeChengZu", index, "keChengShuLiang"]} style={{ marginBottom: 0 }}
                    >
                        <Input type="number" suffix="课时" min={0} />
                    </Form.Item>
                );
            }
        },
        {
            title: '原价',
            dataIndex: 'yuanJia',
            key: 'yuanJia',
            render: (text) => {
                return (
                    <span>￥ {text}</span>
                );
            }
        },
        {
            title: '赠送课时',
            dataIndex: 'zengSongKeShi',
            key: 'zengSongKeShi',
            render: (text, record, index) => {
                return (
                    <Form.Item initialValue={text}
                        rules={[{ required: true, message: "购买数量不能为空" }]}
                        name={["xueYuanKeChengZu", index, "zengSongKeShi"]} style={{ marginBottom: 0 }}
                    >
                        <Input type="number" suffix="课时" min={0} />
                    </Form.Item>
                );
            }
        },
        {
            title: '优惠/折扣',
            dataIndex: 'youHuiShuLiang',
            key: 'youHuiShuLiang',
            render: (text, record, index) => {
                return (
                    <Row>
                        <Col>
                            <Form.Item
                                initialValue={record.youHuiLeiXing}
                                name={["xueYuanKeChengZu", index, "youHuiLeiXing"]}
                                style={{ marginBottom: 0 }}>
                                <Select>
                                    <Option key={YouHuiLeiXing.ZHI_JIAN} value={YouHuiLeiXing.ZHI_JIAN}>{"直减"}</Option>
                                    <Option key={YouHuiLeiXing.ZHE_KOU} value={YouHuiLeiXing.ZHE_KOU}>{"折扣"}</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item initialValue={text}
                                rules={[{ required: true, message: "优惠/折扣不能为空" }]}
                                name={["xueYuanKeChengZu", index, "youHuiShuLiang"]} style={{ marginBottom: 0 }}
                            >
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                    </Row>
                );
            }
        },
        {
            title: '备注',
            dataIndex: 'beiZhu',
            key: 'beiZhu',
            render: (text, record, index) => {
                return (
                    <Form.Item initialValue={text}
                        name={["xueYuanKeChengZu", index, "beiZhu"]} style={{ marginBottom: 0 }}
                    >
                        <Input />
                    </Form.Item>
                );
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (value: XueYuanKeCheng, record, index) => (
                <>
                    <Button type="link" onClick={() => {
                        onRemoveXueYuanKeCheng(value, index);
                    }}>删除</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={50}>
                <Row>
                    <Col>
                        <Button type="primary" onClick={onToggleShowKeChengModel}>选择课程</Button>
                    </Col>
                </Row >
                <Form
                    form={form}
                >
                    <Space direction="vertical" style={{ width: '100%' }} size={50}>
                        <Row >
                            <Col span={24}>
                                <Form.Item name="xueYuanKeChengZu" rules={[{ required: true, message: "请选择购买项目" }]}>
                                    <Table
                                        bordered={true}
                                        dataSource={selectedXueYuanKeCheng}
                                        columns={columns}
                                        pagination={false}
                                        footer={(currentPageData) => {
                                            return (
                                                <Row justify="center">
                                                    <span>aaaaaa</span>
                                                </Row>
                                            );
                                        }}
                                    >
                                    </Table>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col span={14}>
                                <Row justify="end">
                                    <Form.Item>
                                        <Row gutter={10}>
                                            <Col>
                                                <Button disabled={!!xueYuanXinXi?.id} onClick={handleToPreviousStep}>
                                                    上一步
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button type="primary" onClick={handleToNextStep}>
                                                    下一步
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Row>
                            </Col>
                        </Row>
                    </Space>
                </Form>
            </Space>
            <KeChengModal
                visible={showKeChengModal}
                onClose={onToggleShowKeChengModel}
                initialDatas={selectedKeCheng}
                onSearch={onGetKeChengList}
                setSelected={onSelectedKeChengChange}
            />
        </>
    )
}

export default BaoMingGouMaiStep
