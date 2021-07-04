import { Row, Col, Input, Button, Space } from 'antd';
import { useState } from 'react';

import XinZengBanJi from './components/xinzengbanji/XinZengBanJi';

const { Search } = Input;

const BanJiLieBiao = () => {
    const [showXinZengBanJiModal, setShowXinZengBanJiModal] = useState<boolean>(false);

    const toggleShowXinZengBanJi = () => {
        setShowXinZengBanJiModal(!showXinZengBanJiModal);
    }

    return (
        <>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Row>
                    <Col span={7}>
                        <Row align="middle">
                            <Col>
                                <span>搜索班级: </span>
                            </Col>
                            <Col>
                                <Search />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={7}>
                        <Row align="middle">
                            <Col>
                                <span>所属课程: </span>
                            </Col>
                            <Col>
                                <Search />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={7}>
                        <Row align="middle">
                            <Col>
                                <span>班级老师: </span>
                            </Col>
                            <Col>
                                <Search />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={3}>
                        <Row justify="end">
                            <Button type="primary">导出</Button>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Space size="large">
                        <Button type="primary" onClick={toggleShowXinZengBanJi}>添加班级</Button>
                        <Button type="primary">批量结业</Button>
                        <Button type="primary">导出班级名单</Button>
                    </Space>
                </Row>
                <Row>

                </Row>
            </Space>
            {showXinZengBanJiModal ?
                <XinZengBanJi visible={showXinZengBanJiModal} onFormFinish={() => { }} onClose={toggleShowXinZengBanJi} />
                : ""}
        </>
    )
}

export default BanJiLieBiao
