import React from 'react'
import { Row, Col, Form, Space, TimePicker, FormInstance } from 'antd'
import MultipleCalendar from '../../../../components/mutiplecalendar/MultipleCalendar'

type PaiKeFangShiRiLiProps = {
    // 父组件的Form
    parentForm: FormInstance
}

const PaiKeFangShiRiLi: React.FC<PaiKeFangShiRiLiProps> = ({ parentForm }) => {

    const onClendarDatesChange = (dates: number[]) => {
        parentForm.setFieldsValue({ riLiShangKeRiQi: dates });
        console.log(dates)
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <Form.Item
                        labelAlign="left" labelCol={{ span: 6 }} label="日期"
                        name="riLiShangKeRiQi"
                        rules={[{ required: true, message: "" }]}
                    >
                        <MultipleCalendar onDatesChange={onClendarDatesChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item
                        labelAlign="left" labelCol={{ span: 6 }} label="上课时间"
                        name="riLiPaiKeShiJian"
                        rules={[{ required: true, message: "" }]}
                    >
                        <Space>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name={["riLiPaiKeShiJian", "startTime"]}
                                rules={[{ required: true, message: "请选择上课开始时间" }]}
                            >
                                <TimePicker placeholder="开始时间" />
                            </Form.Item>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name={["riLiPaiKeShiJian", "stopTime"]}
                                rules={[{ required: true, message: "请选择上课结束时间" }]}
                            >
                                <TimePicker placeholder="结束时间" />
                            </Form.Item>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </>
    )
}

export default PaiKeFangShiRiLi
