import React from 'react'
import { Row, Col, Button, Form } from 'antd'
import { XueYuanXinXi } from '../../../customtypes'


type BaoMingJieSuanStepProps = {
    onPreviousStep: () => void
    onNextStep: () => void
    xueYuanXinXi: XueYuanXinXi | undefined
}


const BaoMingJieSuanStep: React.FC<BaoMingJieSuanStepProps> = ({ onPreviousStep, onNextStep, xueYuanXinXi }) => {
    const handleToPreviousStep = () => {
        onPreviousStep();
    }

    const handleToNextStep = () => {
        onNextStep();
    }

    return (
        <>
            结算步骤
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
        </>
    )
}

export default BaoMingJieSuanStep
