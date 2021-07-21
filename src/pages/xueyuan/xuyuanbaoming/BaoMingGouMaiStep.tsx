import React, { ChangeEvent, useEffect } from 'react'
import { Space, Row, Col, Button, Form, Table, TableColumnType, Select, Input, InputNumber, DatePicker } from 'antd'
import { DingJiaBiaoZhun, KeCheng, KeChengLeiXing, XueYuanKeCheng, XueYuanKeChengZhuangTai, XueYuanXinXi, YouHuiLeiXing } from '../../../customtypes'
import { useState } from 'react'
import KeChengModal from './KeChengModal'
import { getWeiXuanZeKeChengByXueYuanId } from '../../../services/kecheng'
import { useForm } from 'antd/lib/form/Form'
import { randomId } from '../../../utils'
import { getNewListWithXueYuanKeChengFormData } from '../../../utils/converter'
import moment, { Moment } from 'moment'

const { Option } = Select;


type BaoMingGouMaiStepProps = {
    onPreviousStep: () => void
    onNextStep: () => void
    xueYuanXinXi: XueYuanXinXi | undefined
    initialXueYuanKeChengList: XueYuanKeCheng[] | []
    getSelectedYuanKeChengList?: (list: XueYuanKeCheng[]) => void
    keChengYouXiaoQi?: number | null
    getKeChengYouXiaoQi?: (youXiaoQi: number | null) => void
}

export type xueYuanKeChengFormValueType = {
    // 课程Id
    keChengId: string
    // 课程类型
    keChengLeiXing: KeChengLeiXing
    // 定价标准名称
    dingJiaBiaoZhunMingCheng?: string
    // 课程单价
    danJia: number
    // 购买数量(课程数量)
    keChengShuLiang: number
    // 赠送课时
    zengSongKeShi: number
    // 优惠/折扣 类型
    youHuiLeiXing: YouHuiLeiXing
    // 优惠/折扣 数量
    youHuiShuLiang: number
    // 备注
    beiZhu?: string
}

const BaoMingGouMaiStep: React.FC<BaoMingGouMaiStepProps> = ({ onPreviousStep, onNextStep,
    xueYuanXinXi, initialXueYuanKeChengList, getSelectedYuanKeChengList,
    keChengYouXiaoQi, getKeChengYouXiaoQi }) => {

    const xueYuanKeChengFormFieldName = "xueYuanKeChengZu";
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
        const currDingJiaBiaoZhun = form.getFieldValue([xueYuanKeChengFormFieldName]);
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
        form.setFieldsValue({ [xueYuanKeChengFormFieldName]: newFormValus })

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
                    dingJiaBiaoZhun: undefined,
                    //课程状态
                    keChengZhuangTai: XueYuanKeChengZhuangTai.DAI_QUE_REN,
                    //课程类型
                    keChengLeiXing: KeChengLeiXing.XIN_BAO,
                    //单价
                    danJia: v.danJia,
                    //课程数量
                    keChengShuLiang: 0,
                    //赠送课时
                    zengSongKeShi: 0,
                    //优惠类型
                    youHuiLeiXing: YouHuiLeiXing.ZHI_JIAN,
                    //优惠数量
                    youHuiShuLiang: 0,
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
        const currDingJiaBiaoZhun = form.getFieldValue([xueYuanKeChengFormFieldName]);
        const newValues = [...currDingJiaBiaoZhun];
        newValues.splice(index, 1);
        form.setFieldsValue({ [xueYuanKeChengFormFieldName]: newValues })

        setSelectedXueYuanKeCheng(selectedXueYuanKeCheng.filter(v => v.id !== xueYuanKeCheng.id));
        setSelectedKeCheng(selectedKeCheng.filter(v => v.id !== xueYuanKeCheng.keCheng.id));
    }

    // 表单【定价标准】选择改变
    const handleDingJiaBiaoZhunSelectChange = (currentSelected: string, record: XueYuanKeCheng, index: number) => {
        const currentXueYuanKeChengForm: xueYuanKeChengFormValueType = form.getFieldValue([xueYuanKeChengFormFieldName, index]);
        const dingJiaBiaoZhunSelected: DingJiaBiaoZhun | undefined = record.keCheng.dingJiaBiaoZhunZu?.find(v => v.mingCheng === currentSelected);

        // 更新form表单数据
        // 单价
        currentXueYuanKeChengForm.danJia = dingJiaBiaoZhunSelected ? dingJiaBiaoZhunSelected.keChengDanJia : record.keCheng.danJia;
        // 购买数量
        currentXueYuanKeChengForm.keChengShuLiang = dingJiaBiaoZhunSelected ? dingJiaBiaoZhunSelected.keShi : 0;
        // 优惠/折扣
        currentXueYuanKeChengForm.youHuiShuLiang = dingJiaBiaoZhunSelected ? ((dingJiaBiaoZhunSelected.keChengDanJia * dingJiaBiaoZhunSelected.keShi) - dingJiaBiaoZhunSelected.zongJia) : 0;

        // 更新学员课程state数据
        const newXueYuanKeChengList: XueYuanKeCheng[] = getNewListWithXueYuanKeChengFormData(currentXueYuanKeChengForm, selectedXueYuanKeCheng, index);
        setSelectedXueYuanKeCheng(newXueYuanKeChengList);
    }

    // 表单【课程单价】【购买数量】【优惠/折扣】【备注】change事件
    const onComonInputChange = (index: number) => {
        const currentXueYuanKeChengForm: xueYuanKeChengFormValueType = form.getFieldValue([xueYuanKeChengFormFieldName, index]);

        // 更新学员课程state数据
        const newXueYuanKeChengList: XueYuanKeCheng[] = getNewListWithXueYuanKeChengFormData(currentXueYuanKeChengForm, selectedXueYuanKeCheng, index);
        setSelectedXueYuanKeCheng(newXueYuanKeChengList);
    }

    // 【有效期】change事件
    const onYouXiaoQiChange = (value: Moment | null) => {
        if (getKeChengYouXiaoQi) {
            if (value) {
                getKeChengYouXiaoQi(value.valueOf());
            } else {
                getKeChengYouXiaoQi(null);
            }
        }
    }

    // 获取签约课时
    const getQianYueKeShi = (): number => {
        let keShiTotal: number = 0;
        selectedXueYuanKeCheng.forEach(v => {
            keShiTotal += (Number(v.keChengShuLiang) + Number(v.zengSongKeShi));
        })
        return keShiTotal;
    }

    // 获取签约金额
    const getQianYueJinE = (): number => {
        let jinETotal: number = 0;
        selectedXueYuanKeCheng.forEach(v => {
            let currentTotal: number = (Number(v.danJia) * Number(v.keChengShuLiang));
            if (Number(v.youHuiShuLiang)) {
                if (v.youHuiLeiXing === YouHuiLeiXing.ZHI_JIAN) {
                    currentTotal -= Number(v.youHuiShuLiang)
                } else if (v.youHuiLeiXing === YouHuiLeiXing.ZHE_KOU) {
                    currentTotal = currentTotal * (100 - Number(v.youHuiShuLiang)) / 100
                } else {
                    // 未知的优惠类型
                }
            }
            jinETotal += currentTotal
        })
        return jinETotal;
    }

    // 上一步
    const handleToPreviousStep = () => {
        onPreviousStep();
    }

    // 下一步
    const handleToNextStep = async () => {
        await form.validateFields();
        if (getSelectedYuanKeChengList) {
            getSelectedYuanKeChengList(selectedXueYuanKeCheng);
        }
        onNextStep();
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
                                    name={[xueYuanKeChengFormFieldName, index, "keChengLeiXing"]}
                                    style={{ marginBottom: 0 }}>
                                    <Select onChange={(v) => { onComonInputChange(index) }}>
                                        <Option key={KeChengLeiXing.XIN_BAO} value={KeChengLeiXing.XIN_BAO}>{"新报"}</Option>
                                        <Option key={KeChengLeiXing.KUO_KE} value={KeChengLeiXing.KUO_KE}>{"扩科"}</Option>
                                        <Option key={KeChengLeiXing.XU_BAO} value={KeChengLeiXing.XU_BAO}>{"续报"}</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item style={{ marginBottom: 0 }}
                                    initialValue={record.keChengId || record.keCheng.id}
                                    name={[xueYuanKeChengFormFieldName, index, "keChengId"]}
                                >
                                    <>{text}</>
                                </Form.Item>
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
                        name={[xueYuanKeChengFormFieldName, index, "dingJiaBiaoZhunMingCheng"]}
                        initialValue={record.dingJiaBiaoZhun?.mingCheng}
                        style={{ marginBottom: 0 }}>
                        <Select allowClear={true} onChange={(currentValue) => handleDingJiaBiaoZhunSelectChange(currentValue?.toString() || "", record, index)}>
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
            dataIndex: "danJia",
            key: 'danJia',
            render: (text, record, index) => {
                return (
                    <Form.Item initialValue={text}
                        rules={[{ required: true, message: "课程单价不能为空" }]}
                        name={[xueYuanKeChengFormFieldName, index, "danJia"]} style={{ marginBottom: 0 }}
                    >
                        <Input onChange={(e) => { onComonInputChange(index) }} prefix="￥" suffix="/课时" type="number" min={1} />
                    </Form.Item>
                );
            }
        },
        {
            title: '购买数量',
            dataIndex: 'keChengShuLiang',
            key: 'keChengShuLiang',
            width: '11%',
            render: (text, record, index) => {
                return (
                    <Form.Item initialValue={text}
                        rules={[{ required: true, message: "购买数量不能为空" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value < 1) {
                                    return Promise.reject(new Error("应至少购买一个课时"));
                                }
                                return Promise.resolve();
                            },
                        })]}
                        name={[xueYuanKeChengFormFieldName, index, "keChengShuLiang"]} style={{ marginBottom: 0 }}
                    >
                        <Input onChange={(e) => { onComonInputChange(index) }} type="number" addonAfter={<span>课时</span>} min={1} />
                    </Form.Item>
                );
            }
        },
        {
            title: '原价',
            dataIndex: 'yuanJia',
            key: 'yuanJia',
            width: 100,
            render: (text, record) => {
                return (
                    <span>￥ {record.danJia * record.keChengShuLiang}</span>
                );
            }
        },
        {
            title: '赠送课时',
            dataIndex: 'zengSongKeShi',
            key: 'zengSongKeShi',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <Form.Item initialValue={text}
                        rules={[{ required: true, message: "赠送课时不能为空" }]}
                        name={[xueYuanKeChengFormFieldName, index, "zengSongKeShi"]}
                        style={{ marginBottom: 0 }}
                    >
                        <Input onChange={(e) => { onComonInputChange(index) }} type="number" addonAfter={<span>课时</span>} min={0} />
                    </Form.Item>
                );
            }
        },
        {
            title: '优惠/折扣',
            dataIndex: 'youHuiShuLiang',
            key: 'youHuiShuLiang',
            width: '15%',
            render: (text, record, index) => {
                return (
                    <Row>
                        <Col>
                            <Form.Item
                                initialValue={record.youHuiLeiXing}
                                name={[xueYuanKeChengFormFieldName, index, "youHuiLeiXing"]}
                                style={{ marginBottom: 0 }}>
                                <Select
                                    onChange={(e) => onComonInputChange(index)}
                                >
                                    <Option key={YouHuiLeiXing.ZHI_JIAN} value={YouHuiLeiXing.ZHI_JIAN}>{"直减"}</Option>
                                    <Option key={YouHuiLeiXing.ZHE_KOU} value={YouHuiLeiXing.ZHE_KOU}>{"折扣"}</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item initialValue={text}
                                rules={[
                                    { required: true, message: "优惠/折扣不能为空" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const currentXueYuanKeChengForm: xueYuanKeChengFormValueType = form.getFieldValue([xueYuanKeChengFormFieldName, index]);
                                            if (currentXueYuanKeChengForm.youHuiLeiXing === YouHuiLeiXing.ZHE_KOU) {
                                                if (value > 100 || value < 0) {
                                                    return Promise.reject(new Error('折扣优惠时，优惠范围为0-100'));
                                                }
                                            }
                                            if (currentXueYuanKeChengForm.youHuiLeiXing === YouHuiLeiXing.ZHI_JIAN) {
                                                if (value > currentXueYuanKeChengForm.danJia * currentXueYuanKeChengForm.keChengShuLiang) {
                                                    return Promise.reject(new Error('直减优惠时，优惠值不能大于原价'));
                                                }
                                            }
                                            return Promise.resolve();
                                        },
                                    })
                                ]}
                                name={[xueYuanKeChengFormFieldName, index, "youHuiShuLiang"]} style={{ marginBottom: 0 }}
                            >
                                <Input type="number" onChange={(e) => { onComonInputChange(index) }} min={0} step={5} />
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
                        name={[xueYuanKeChengFormFieldName, index, "beiZhu"]} style={{ marginBottom: 0 }}
                    >
                        <Input onChange={(e) => { onComonInputChange(index) }} />
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
                                <Form.Item name={xueYuanKeChengFormFieldName} rules={[{ required: true, message: "请选择购买项目" }]}>
                                    <Table
                                        bordered={true}
                                        dataSource={selectedXueYuanKeCheng}
                                        columns={columns}
                                        pagination={false}
                                        footer={(currentPageData) => {
                                            return (
                                                <Row justify="end">
                                                    <Space direction="horizontal">
                                                        <Col>
                                                            <>
                                                                <span>有效期至：</span>
                                                                <DatePicker
                                                                    disabledDate={(current) => {
                                                                        return current < moment().add(-1, 'days');
                                                                    }}
                                                                    defaultValue={keChengYouXiaoQi ? moment(keChengYouXiaoQi) : undefined}
                                                                    onChange={onYouXiaoQiChange} />
                                                            </>
                                                        </Col>
                                                        <Col>
                                                            <><span>签约课时：</span><span style={{ color: '#1890ff' }}>{getQianYueKeShi()}</span></>
                                                        </Col>
                                                        <Col>
                                                            <>签约金额：<span style={{ color: '#1890ff' }}>{getQianYueJinE()}</span></>
                                                        </Col>
                                                    </Space>
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
                                                <Button onClick={handleToPreviousStep}>
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
            {showKeChengModal ? <KeChengModal
                visible={showKeChengModal}
                onClose={onToggleShowKeChengModel}
                initialDatas={selectedKeCheng}
                onSearch={onGetKeChengList}
                setSelected={onSelectedKeChengChange}
            /> : ""}

        </>
    )
}

export default BaoMingGouMaiStep
