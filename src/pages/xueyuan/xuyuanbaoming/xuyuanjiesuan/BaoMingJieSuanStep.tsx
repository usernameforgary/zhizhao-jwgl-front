import React, { useEffect } from 'react'
import { Row, Col, Button, Form, Space, Input, Radio, DatePicker, Select } from 'antd'
import { JiaoFeiLiShi, LiuShuiLieXing, ShouKuanFangShi, XueYuanKeCheng, XueYuanXinXi, YouHuiLeiXing, YuanGong, ZhangHaoLeiXing } from '../../../../customtypes'

import './baomingjiesuanstep.css'
import { useForm } from 'antd/lib/form/Form'
import { AlipayCircleOutlined, WechatOutlined, MoneyCollectOutlined } from '@ant-design/icons'
import moment, { Moment, now } from 'moment'
import { huoQuYuanGongLieBiaoAll } from '../../../../services/account'
import { useState } from 'react'

const { Option } = Select;

type BaoMingJieSuanStepProps = {
    onPreviousStep: () => void
    onNextStep: () => void
    xueYuanXinXi: XueYuanXinXi | undefined
    xueYuanKeChengList: XueYuanKeCheng[]
    getJiaoFenJiLuGenJinRen: (genJiRenId: string) => void
    getJiaoFenLiShi: (jiaoFeiLiShi: JiaoFeiLiShi) => void
}

export type BaoMingJieDuanStepFormType = {
    // 实交金额
    shiJiaoJinE: number
    // 收款方式
    shouKuanFangShi: ShouKuanFangShi
    // 缴费日期
    jiaoFeiRiQi: Moment
    // 跟进人
    genJinRenId: string
    // 备注
    beiZhu: string
}

/**
 * 报名 - 费用结算页面
 * @param param0 
 * @returns 
 */
const BaoMingJieSuanStep: React.FC<BaoMingJieSuanStepProps> = ({ onPreviousStep, onNextStep, xueYuanXinXi, xueYuanKeChengList, getJiaoFenJiLuGenJinRen, getJiaoFenLiShi }) => {
    const [form] = useForm();
    const [yuanGongList, setYuanGongList] = useState<YuanGong[]>([]);

    const shiJiaoJinEFormItemName = "shiJiaoJinE";
    const shouKuanFangShiFormItemName = "shouKuanFangShi";
    const jiaoFeiRiQiFormItemName = "jiaoFeiRiQi";
    const genJinRenIdFormItemName = "genJinRenId";
    const beiZhuFormItemName = "beiZhu";

    useEffect(() => {
        let isMounted = true;

        // 获取所有员工
        const huoQuYuanGong = async () => {
            const res: YuanGong[] = await huoQuYuanGongLieBiaoAll(ZhangHaoLeiXing.YUAN_GONG);
            setYuanGongList(res);
        }

        try {
            huoQuYuanGong();
        } catch (e) { }

        return () => {
            isMounted = false;
        }
    }, [])

    // 上一步事件
    const handleToPreviousStep = () => {
        onPreviousStep();
    }

    // 确认报名click事件
    const handleToNextStep = async () => {
        await form.validateFields();
        const formData: BaoMingJieDuanStepFormType = form.getFieldsValue();

        // 跟进人
        if (formData.genJinRenId) {
            getJiaoFenJiLuGenJinRen(formData.genJinRenId);
        }

        // 新增缴费历史（同一个缴费记录，可以多次缴费，此时为第一次缴费）
        const jiaoFeiLiShi: JiaoFeiLiShi = {
            // 缴费金额
            jiaoFeiJinE: Number(formData.shiJiaoJinE),
            // 收款方式
            shouKuanFangShi: formData.shouKuanFangShi,
            // 缴费日期
            jiaoFeiRiQi: formData.jiaoFeiRiQi ? formData.jiaoFeiRiQi.valueOf() : undefined,
            // 备注
            beiZhu: formData.beiZhu,
            // 流水类型
            liuShuiLieXing: LiuShuiLieXing.XIN_JIAO
        }

        getJiaoFenLiShi(jiaoFeiLiShi);

        onNextStep();
    }

    // 全额交款click事件
    const handleQuanEJiaoKuan = () => {
        form.setFieldsValue({ [shiJiaoJinEFormItemName]: getQianYueJinE() })
    }

    // 获取签约金额
    const getQianYueJinE = (): number => {
        let jinETotal: number = 0;
        xueYuanKeChengList.forEach(v => {
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

    return (
        <>
            <Form
                initialValues={{
                    [jiaoFeiRiQiFormItemName]: moment()
                }}
                form={form}
            >
                <Row>
                    <Space direction="vertical" style={{ width: '100%' }} size={40}>
                        <Col span={24}>
                            <Row style={{ marginBottom: 10 }}>
                                <span className={"item-title"}>信息确认</span>
                            </Row>
                            <Row>
                                <Col offset={1} span={23}>
                                    <Row className={"item-content-row"}>
                                        <span>{xueYuanXinXi?.xingMing}<span style={{ paddingLeft: 20 }}>{xueYuanXinXi?.zhangHaoShouJi}</span></span>
                                    </Row>
                                    <Row justify="space-around" className={"item-content-table-tile"}>
                                        <Col><span>项目</span></Col>
                                        <Col><span>数量</span></Col>
                                        <Col><span>金额</span></Col>
                                    </Row>
                                    {xueYuanKeChengList.map((v, i) => {
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
                                        return (<Row key={i} justify="space-around" className={"item-content-table-row"}>
                                            <Col><span>{v.keCheng.mingCheng}</span></Col>
                                            <Col><span>{v.keChengShuLiang}课时</span></Col>
                                            <Col><span>{currentTotal}</span></Col>
                                        </Row>)
                                    })}
                                    <Row justify="end">
                                        <span>合计金额：{getQianYueJinE()}</span>
                                    </Row>

                                </Col>
                            </Row>

                        </Col>

                        <Col span={24}>
                            <Row style={{ marginBottom: 10 }}>
                                <span className={"item-title"}>收款信息</span>
                            </Row>
                            <Row>
                                <Col offset={1} span={23}>
                                    <Row className={"item-content-row"}>
                                        <span>应交金额:<span style={{ fontSize: 20, paddingLeft: 10 }}>{getQianYueJinE()}</span> 元</span>
                                    </Row>
                                    <Row className={"item-content-row"}>
                                        <Col span={6}>
                                            <Form.Item
                                                label={"实交金额"}
                                                name={shiJiaoJinEFormItemName}
                                                labelAlign="left" labelCol={{ span: 8 }}
                                                rules={[
                                                    { required: true, message: "请填写实缴金额" },
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            if (Number(value) > getQianYueJinE()) {
                                                                return Promise.reject(new Error('实交金额应不大于应交金额'));
                                                            }
                                                            if (Number(value) < 0) {
                                                                return Promise.reject(new Error('实交金额应不小于0'));
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    })
                                                ]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Input type="number" addonAfter={<span>元</span>} min={0} step={5} />
                                            </Form.Item>

                                        </Col>
                                        <Col>
                                            <Button onClick={handleQuanEJiaoKuan}>全额交款</Button>
                                        </Col>
                                    </Row>
                                    <Row className={"item-content-row"}>
                                        <Col span={12}>
                                            <Form.Item
                                                initialValue={ShouKuanFangShi.WEI_XIN}
                                                name={shouKuanFangShiFormItemName}
                                                labelAlign="left" labelCol={{ span: 4 }}
                                                label={"收款方式"}
                                                rules={[
                                                    { required: true, message: "请选择收款方式" },
                                                ]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Radio.Group>
                                                    <Space>
                                                        <Radio.Button value={ShouKuanFangShi.ZHI_FU_BAO} >
                                                            <Row>
                                                                <AlipayCircleOutlined style={{ fontSize: '200%' }} />
                                                                <span>&nbsp;支付宝</span>
                                                            </Row>
                                                        </Radio.Button>
                                                        <Radio.Button value={ShouKuanFangShi.WEI_XIN}>
                                                            <Row>
                                                                <WechatOutlined style={{ fontSize: '200%' }} />
                                                                <span>&nbsp;微信</span>
                                                            </Row>
                                                        </Radio.Button>
                                                        <Radio.Button value={ShouKuanFangShi.XIAN_JIN}>
                                                            <Row>
                                                                <MoneyCollectOutlined style={{ fontSize: '200%' }} />
                                                                <span>&nbsp;现金</span>
                                                            </Row>
                                                        </Radio.Button>
                                                    </Space>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Col>

                        <Col span={24}>
                            <Row style={{ marginBottom: 10 }}>
                                <span className={"item-title"}>其他信息</span>
                            </Row>
                            <Row>
                                <Col offset={1} span={23}>
                                    <Row>
                                        <Col span={6}>
                                            <Form.Item
                                                name={jiaoFeiRiQiFormItemName}
                                                labelAlign="left" labelCol={{ span: 8 }}
                                                label={"交费日期"}
                                            >
                                                <DatePicker showTime />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6}>
                                            <Form.Item
                                                initialValue={xueYuanXinXi?.genJinRenId}
                                                name={genJinRenIdFormItemName}
                                                labelAlign="left" labelCol={{ span: 8 }}
                                                label={"跟进人"}
                                            >
                                                <Select>
                                                    {yuanGongList?.map(k => {
                                                        return (
                                                            <Option key={k.id} value={k.id || ""}>{k.xingMing}</Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6}>
                                            <Form.Item
                                                labelAlign="left" labelCol={{ span: 8 }}
                                                label={"备注"}
                                                name={beiZhuFormItemName}
                                            >
                                                <Input.TextArea />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Space>

                </Row>
            </Form>
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
                                        确认报名
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default BaoMingJieSuanStep
