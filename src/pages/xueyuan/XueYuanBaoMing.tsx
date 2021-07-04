import { Steps } from 'antd'
import React from 'react'

const { Step } = Steps;

const XueYuanBaoMing = () => {
    return (
        <>
            <Steps current={1}>
                <Step key={"学员信息"} title="学员信息"></Step>
                <Step key={"购买项目"} title="购买项目"></Step>
                <Step key={"费用结算"} title="费用结算"></Step>
            </Steps>
        </>
    )
}

export default XueYuanBaoMing
