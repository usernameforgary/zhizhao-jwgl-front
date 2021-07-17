import { Row, Col, Form, DatePicker, Radio, Input, RadioChangeEvent, FormInstance, TimePicker, Space } from 'antd'
import { Dayjs } from 'dayjs'
import { Moment } from 'moment'
import React, { useState } from 'react'
import { PaiKeChongFuFangShiFenLei, PaiKeJieShuFangShiFenLei } from '../../../../customtypes'
import {
    convertPaiKeChongFuFangShi2Enum, convertPaiKeChongFuFangShi2Text,
    convertPaiKeJieShuFangShi2Text, convertPaiKeJieShuShi2Enum
} from '../../../../utils/converter'
import PaiKeZhouChongFu, { PaiKeChongFuShiJian } from './PaiKeZhouChongFu'

type PaiKeFangShiGuiZeProps = {
    guiZeChongFuFangShi: PaiKeChongFuFangShiFenLei
    handleGuiZeChongFuFangShiChange: (newChongFuFangShi: PaiKeChongFuFangShiFenLei) => void
    guiZeJieShuFangShi: PaiKeJieShuFangShiFenLei
    handleGuiZeJieShuFangshiChange: (newJieShuFangShi: PaiKeJieShuFangShiFenLei) => void
    // 父组件的Form
    parentForm: FormInstance
}

/**
 * 规则排课
 * @param param0 
 * @returns 
 */
const PaiKeFangShiGuiZe: React.FC<PaiKeFangShiGuiZeProps> = ({
    guiZeChongFuFangShi,
    handleGuiZeChongFuFangShiChange,
    guiZeJieShuFangShi,
    handleGuiZeJieShuFangshiChange,
    parentForm
}) => {

    // 排课开始日期
    const [paiKeKaiShiRiQi, setPaiKeKaiShiRiQi] = useState<Moment>();

    // 排课重复方式改变
    const onPaiKeChongFuFangShiChange = (e: RadioChangeEvent) => {
        const paiKeChongFuFangshiVal: string = e.target.value;
        const paiKeChongFiFangShi: PaiKeChongFuFangShiFenLei = convertPaiKeChongFuFangShi2Enum(paiKeChongFuFangshiVal);
        handleGuiZeChongFuFangShiChange(paiKeChongFiFangShi);

        // 重置【重复上课时间】表单值
        handlePaiKeShangKeShiJian([]);
    }

    // 排课结束方式改变
    const onPaiKeJieShuFangShiChange = (e: RadioChangeEvent) => {
        const paiKeJieShuFangshiVal: string = e.target.value;
        const paiKeJieShuFangShi: PaiKeJieShuFangShiFenLei = convertPaiKeJieShuShi2Enum(paiKeJieShuFangshiVal);
        handleGuiZeJieShuFangshiChange(paiKeJieShuFangShi);
    }

    // 排课重复方式上课时间设定
    const handlePaiKeShangKeShiJian = (chongFuShiJian: PaiKeChongFuShiJian[]) => {
        parentForm.setFieldsValue({ guiZeChongFuMeiZhou: chongFuShiJian });
    }

    // TODO 用dayjs替换Moment
    // 排课开始日期改变
    const handlePaiKeKaiShiRiQiChange = (date: Moment | null, dateString: string) => {
        if (date) {
            setPaiKeKaiShiRiQi(date);
        }
    }

    // 结束日期不能小于开始日期的限制
    const handlePaiKeJiShuRiQiDisabledDate = (currentDate: Moment) => {
        return currentDate && currentDate.isBefore(paiKeKaiShiRiQi);
    }

    return (
        <>
            <Row>
                <Col span={18}>
                    <Form.Item
                        labelAlign="left" labelCol={{ span: 8 }} label="开始日期"
                        name="guiZeKaiShiRiQi"
                        rules={[{ required: true, message: "请选择开始日期" }]}
                    >
                        <DatePicker onChange={handlePaiKeKaiShiRiQiChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={18}>
                    <Form.Item
                        labelAlign="left" labelCol={{ span: 8 }} label="重复方式"
                        name="guiZeChongFuFangShi"
                        initialValue={PaiKeChongFuFangShiFenLei.MEI_ZHOU}
                        rules={[{ required: true, message: "请指定重复方式" }]}
                    >
                        <Radio.Group onChange={onPaiKeChongFuFangShiChange}>
                            <Radio value={PaiKeChongFuFangShiFenLei.MEI_TIAN}>{convertPaiKeChongFuFangShi2Text(PaiKeChongFuFangShiFenLei.MEI_TIAN)}</Radio>
                            <Radio value={PaiKeChongFuFangShiFenLei.MEI_ZHOU}>{convertPaiKeChongFuFangShi2Text(PaiKeChongFuFangShiFenLei.MEI_ZHOU)}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            {
                guiZeChongFuFangShi && guiZeChongFuFangShi === PaiKeChongFuFangShiFenLei.MEI_TIAN ?

                    <Row>
                        <Col span={24}>
                            <Form.Item
                                labelAlign="left" labelCol={{ span: 6 }} label="上课时间"
                                name="guiZeChongFuMeiTian"
                                rules={[{ required: true, message: "" }]}
                            >
                                <Space>
                                    <Form.Item
                                        style={{ marginBottom: 0 }}
                                        name={["guiZeChongFuMeiTian", "startTime"]}
                                        rules={[{ required: true, message: "请选择上课开始时间" }]}
                                    >
                                        <TimePicker format="HH:mm" placeholder="开始时间" />
                                    </Form.Item>
                                    <span>~</span>
                                    <Form.Item
                                        style={{ marginBottom: 0 }}
                                        name={["guiZeChongFuMeiTian", "stopTime"]}
                                        rules={[{ required: true, message: "请选择上课结束时间" }]}
                                    >
                                        <TimePicker format="HH:mm" placeholder="结束时间" />
                                    </Form.Item>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                labelAlign="left" labelCol={{ span: 8 }} label=""
                                name="guiZeChongFuMeiZhou"
                                rules={[{ required: true, message: "请指定重复上课时间" }]}
                            >
                                <PaiKeZhouChongFu
                                    onSetPaiKeChongFuShiJian={handlePaiKeShangKeShiJian}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
            }
            <Row>
                <Col span={18}>
                    <Form.Item
                        labelAlign="left" labelCol={{ span: 8 }} label="结束方式"
                        name="guiZeJieShuFangShi"
                        initialValue={PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU}
                        rules={[{ required: true, message: "请指定结束方式" }]}
                    >
                        <Radio.Group onChange={onPaiKeJieShuFangShiChange}>
                            <Radio value={PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU}>{convertPaiKeJieShuFangShi2Text(PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU)}</Radio>
                            <Radio value={PaiKeJieShuFangShiFenLei.CI_SHU_JIE_SHU}>{convertPaiKeJieShuFangShi2Text(PaiKeJieShuFangShiFenLei.CI_SHU_JIE_SHU)}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            {
                (guiZeJieShuFangShi && guiZeJieShuFangShi === PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU) ? (
                    <>
                        <Row>
                            <Col span={18}>
                                <Form.Item
                                    labelAlign="left" labelCol={{ span: 8 }} label="结束日期"
                                    name="guiZeJieShuRiQi"
                                    rules={[{ required: true, message: "请选择结束日期" }, ({ getFieldValue }) => ({
                                        validator(_, value: Dayjs) {
                                            if (value) {
                                                const guiZeKaiShiRiQi: Dayjs = getFieldValue(["guiZeKaiShiRiQi"]);
                                                if (guiZeKaiShiRiQi) {
                                                    if (value.isBefore(guiZeKaiShiRiQi)) {
                                                        return Promise.reject("结束日期不能早于开始日期")
                                                    }
                                                }
                                            }
                                            return Promise.resolve();
                                        },
                                    })]}
                                >
                                    <DatePicker
                                        disabledDate={handlePaiKeJiShuRiQiDisabledDate}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                ) : (<>
                    <Row>
                        <Col span={18}>
                            <Form.Item
                                initialValue={1}
                                labelAlign="left" labelCol={{ span: 8 }} label="排课次数"
                                name="guiZeJieShuCiShu"
                                rules={[{ required: true, message: "请输入排课次数" }]}
                            >
                                <Input type="number" min={1} />
                            </Form.Item>
                        </Col>
                    </Row>
                </>)
            }
        </>
    )
}

export default PaiKeFangShiGuiZe
