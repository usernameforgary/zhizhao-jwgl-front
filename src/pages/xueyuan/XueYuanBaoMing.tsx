import { Steps, Row, Col, Space } from 'antd'
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { XueYuanXinXi } from '../../customtypes';
import { huoQuXueYaunXinXi } from '../../services/xueyuan';
import BaoMingJiBenXinXiStep from './xuyuanbaoming/BaoMingJiBenXinXiStep';

const { Step } = Steps;

type XueYuanBaoMingParamType = {
    xueYuanId: string
}

class XueYuanBaoMingStore {
    constructor(xueYuanId: string) {
        this.xueYuanId = xueYuanId;
        makeObservable(this);
    }

    // 学员Id
    @observable
    xueYuanId: string = "";
    // 学员信息
    @observable
    xueYuanXinXi: XueYuanXinXi | undefined = undefined;

    // 临时保存学员名称，因为重新选择不存在的学员后，学员信息会重新刷新，导致页面上学生姓名项取不到刚才输入的值
    @observable
    tempXueYuanName: string = "";

    @action
    setTempXueYuanName = (value: string) => {
        this.tempXueYuanName = value;
    }

    @action
    setXueYuanId = (id: string): void => {
        this.xueYuanId = id;
    }

    // 获取学员信息
    @action
    setXueYuanXinXi = async (): Promise<void> => {
        if (this.xueYuanId) {
            try {
                const xueYuanXinXi: XueYuanXinXi = await huoQuXueYaunXinXi(this.xueYuanId);
                this.xueYuanXinXi = xueYuanXinXi;
            } catch (e) { }
        } else {
            this.xueYuanXinXi = undefined;
        }
    }
}

const XueYuanBaoMing = () => {
    const { xueYuanId } = useParams<XueYuanBaoMingParamType>();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [viewStore] = useState<XueYuanBaoMingStore>(new XueYuanBaoMingStore(xueYuanId));

    const { xueYuanXinXi } = viewStore;

    useEffect(() => {
        viewStore.setXueYuanXinXi();
    }, [viewStore.xueYuanId]);

    // 下一步
    const onNextStep = () => {
        setCurrentStep(currentStep + 1);
    }

    // 学员选择改变
    const onXueYuanChange = (xueYuanId: string, tempXueYuanName?: string) => {
        viewStore.setXueYuanId(xueYuanId)

        if (!!tempXueYuanName) {
            viewStore.setTempXueYuanName(tempXueYuanName);
        }
    }

    return (
        <div
            className={"content-background"}
            style={{
                padding: 24,
                margin: 0,
                minHeight: "85vh"
            }}
        >
            <Space direction="vertical" style={{ width: "100%" }} size={50}>
                <Row>
                    <Steps current={currentStep}>
                        <Step key={"学员信息"} title="学员信息">
                        </Step>
                        <Step key={"购买项目"} title="购买项目">
                        </Step>
                        <Step key={"费用结算"} title="费用结算">
                        </Step>
                    </Steps>
                </Row>
                <Row>
                    <Col span={24}>
                        {currentStep === 0 ?
                            <BaoMingJiBenXinXiStep
                                xueYuanXinXi={xueYuanXinXi}
                                changeXueYuan={onXueYuanChange}
                                onNextStep={onNextStep}
                                tempXueYuanName={viewStore.tempXueYuanName}
                            /> : ""}
                    </Col>
                </Row>
            </Space>
        </div>
    )
}

export default observer(XueYuanBaoMing);
