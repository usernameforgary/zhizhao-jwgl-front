import React, { useState } from 'react'
import { Form, Row, Col, Input, Radio, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import DingJianBiaoZhunForm from '../components/DingJianBiaoZhunForm';
import { KeCheng } from '../../../customtypes';
import { useForm } from 'antd/lib/form/Form';
import { xinJianKeCheng } from '../../../services/kecheng';
import Loading from '../../../components/loading/Loading';
import { randomId } from '../../../utils';

const XinJianKeCheng = () => {
    const history = useHistory();
    const [form] = useForm();
    const [loading, setLoading] = useState<boolean>(false);

    // 新建课程handler
    const onXinJianKeCheng = async (keCheng: KeCheng) => {
        console.log(keCheng)
        setLoading(true);
        await xinJianKeCheng(keCheng).catch(e => {
            setLoading(false);
            return;
        });
        history.goBack();
    }

    const onFormFinish = (values: any) => {
        const keCheng: KeCheng = {
            id: randomId(),
            mingCheng: values.mingCheng,
            danJia: values.danJia,
            dingJiaBiaoZhunZu: values.dingJiaBiaoZhunZu,
            qingJiaKouKeShi: values.qingJiaKouKeShi,
            weiDaoKouKeShi: values.weiDaoKouKeShi,
            beiZhu: values.beiZhu
        }
        onXinJianKeCheng(keCheng);
    }

    const onFormValuesChange = (values: any, allValues: any) => {
        // do nothing
    }

    const onFormFiledsChange = (values: any, allValues: any) => {
        // do nothing
    }

    return (
        <>
            {loading ? <Loading></Loading> : ""}
            <Form
                onFinish={onFormFinish}
                form={form}
                onValuesChange={onFormValuesChange}
                onFieldsChange={onFormFiledsChange}
            >
                <Row>
                    <Col span={12}>
                        <Form.Item name="mingCheng" label="课程名称" labelAlign="left" labelCol={{ span: 6 }} rules={[{ required: true, message: "请填写课程名称" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="danJia" label="课程单价" labelAlign="left" labelCol={{ span: 6 }} rules={[{ required: true, message: "请填写课程单价" }]}>
                            <Input type="number" min={0} addonAfter={<span>元/课时</span>} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={18}>
                        <Form.Item name="dingJiaBiaoZhunZu" label="定价标准" labelAlign="left" labelCol={{ span: 4 }}>
                            <DingJianBiaoZhunForm
                                dingJiaBiaoZhunDatas={[]}
                                form={form}
                                parentFormFieldName="dingJiaBiaoZhunZu"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={3}>
                        <div>其他信息:</div>
                    </Col>
                    <Col span={18}>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="qingJiaKouKeShi" label="请假是否扣课时" initialValue={false} labelAlign="left" labelCol={{ span: 8 }} colon={false}>
                                    <Radio.Group>
                                        <Radio value={true}>扣</Radio>
                                        <Radio value={false}>不扣</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="weiDaoKouKeShi" label="未到是否扣课时" initialValue={true} labelAlign="left" labelCol={{ span: 8 }} colon={false}>
                                    <Radio.Group>
                                        <Radio value={true}>扣</Radio>
                                        <Radio value={false}>不扣</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="beiZhu" label="备注" labelAlign="left" labelCol={{ span: 8 }}>
                                    <Input.TextArea />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row justify="end">
                    <Col span={12}>
                        <Form.Item>
                            <Row gutter={10}>
                                <Col>
                                    <Button onClick={() => history.goBack()}>
                                        取消
                                    </Button>
                                </Col>
                                <Col>
                                    <Button type="primary" htmlType="submit">
                                        保存
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </>
    )
}

export default XinJianKeCheng
