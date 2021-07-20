import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Row, Col } from 'antd';
import { getStore } from '../../store/useStore';
import { IMainStore } from '../../customtypes';

import "./denglu.css"
import { login } from '../../services/account';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const DengLu = () => {
    const store = getStore() as IMainStore;
    const history = useHistory();

    const doLogin = async (shouJi: string, miMa: string) => {
        try {
            const token = await login(shouJi, miMa);
            if (token) {
                store.login(token);
                history.push('/sys');
            }
        } catch (err) {
        } finally {
        }
    }

    return (
        <div className="dengLuForm">
            <Row>
                <Col span={8} offset={8}>
                    <Form
                        {...layout}
                        name="basic"
                        onFinish={values => {
                            doLogin(values.shouJi, values.miMa);
                        }}
                    >
                        <Row justify="center">
                            <Form.Item
                                labelAlign="left"
                                label="手机号"
                                name="shouJi"
                                rules={[{ required: true, message: '请输入手机号!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Row>

                        <Row justify="center">
                            <Form.Item
                                labelAlign="left"
                                label="密码"
                                name="miMa"
                                rules={[{ required: true, message: '请输入密码!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Row>

                        <Row justify="center">
                            <Col span={8}>
                                <Button type="primary" htmlType="submit" block>
                                    登录
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default DengLu;