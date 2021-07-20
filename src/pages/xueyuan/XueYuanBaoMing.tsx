import { Steps, Row, Col, Space } from 'antd'
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { XueYuanKeCheng, XueYuanXinXi } from '../../customtypes';
import { huoQuXueYaunXinXi } from '../../services/xueyuan';
import BaoMingGouMaiStep from './xuyuanbaoming/BaoMingGouMaiStep';
import BaoMingJiBenXinXiStep from './xuyuanbaoming/BaoMingJiBenXinXiStep';
import BaoMingJieSuanStep from './xuyuanbaoming/BaoMingJieSuanStep';

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

    // 学员课程
    @observable
    xueYuanKeChengList: XueYuanKeCheng[] = [];

    // 学员课时有效期（多个学员课时公用一个有效期）
    @observable
    keChengYouXiaoQi: number | null = null;

    @action
    setXueYuanId = (id: string): void => {
        this.xueYuanId = id;
    }

    @observable
    setXueYuanKeChengList = (list: XueYuanKeCheng[]) => {
        this.xueYuanKeChengList = list;
    }

    @action
    setXueYuanXinXi = (xueYuanXinXi: XueYuanXinXi | undefined) => {
        this.xueYuanXinXi = xueYuanXinXi;
    }

    @action
    setKeChengYouXiaoQi = (v: number | null) => {
        this.keChengYouXiaoQi = v;
    }

    // 获取学员信息
    @action
    initialXueYuanXinXi = async (): Promise<void> => {
        if (this.xueYuanId) {
            try {
                const xueYuanXinXi: XueYuanXinXi = await huoQuXueYaunXinXi(this.xueYuanId);
                this.setXueYuanXinXi(xueYuanXinXi);
            } catch (e) { }
        }
    }
}

const XueYuanBaoMing = () => {
    const { xueYuanId } = useParams<XueYuanBaoMingParamType>();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [viewStore] = useState<XueYuanBaoMingStore>(new XueYuanBaoMingStore(xueYuanId));

    const { xueYuanXinXi } = viewStore;

    useEffect(() => {
        viewStore.initialXueYuanXinXi();
    }, [viewStore.xueYuanId]);

    // 上一步
    const onPreviousStep = () => {
        setCurrentStep(currentStep - 1);
    }

    // 下一步
    const onNextStep = () => {
        setCurrentStep(currentStep + 1);
    }

    // 学员选择改变
    const onXueYuanIdChange = (xueYuanId: string) => {
        viewStore.setXueYuanId(xueYuanId)
    }

    // 新的学员
    const onSetNewXueYuanXinXi = (newXueYuanXinXi: XueYuanXinXi) => {
        viewStore.setXueYuanXinXi(newXueYuanXinXi);
        viewStore.setXueYuanId("");
    }

    // 设置有效期
    const onSetKeChengYouXiaoQi = (value: number | null) => {
        viewStore.setKeChengYouXiaoQi(value)
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
                                changeXueYuanById={onXueYuanIdChange}
                                setNewXueYuanXinXi={onSetNewXueYuanXinXi}
                                onNextStep={onNextStep}
                            /> : ""}

                        {currentStep === 1 ?
                            <BaoMingGouMaiStep
                                xueYuanXinXi={xueYuanXinXi}
                                onPreviousStep={onPreviousStep}
                                onNextStep={onNextStep}
                                initialXueYuanKeChengList={viewStore.xueYuanKeChengList}
                                keChengYouXiaoQi={viewStore.keChengYouXiaoQi}
                                getKeChengYouXiaoQi={onSetKeChengYouXiaoQi}
                                getSelectedYuanKeChengList={viewStore.setXueYuanKeChengList}
                            /> : ""}
                        {currentStep === 2 ?
                            <BaoMingJieSuanStep
                                xueYuanXinXi={xueYuanXinXi}
                                onPreviousStep={onPreviousStep}
                                onNextStep={onNextStep}

                            /> : ""}
                    </Col>
                </Row>
            </Space>
        </div>
    )
}

export default observer(XueYuanBaoMing);
