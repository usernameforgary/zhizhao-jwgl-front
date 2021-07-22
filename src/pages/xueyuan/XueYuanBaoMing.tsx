import { Steps, Row, Col, Space } from 'antd'
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { JiaoFeiLiShi, XueYuanKeCheng, XueYuanXinXi } from '../../customtypes';
import { getDefinedRouteByRouteName, routeName } from '../../router';
import { xueYuanBaoMing } from '../../services/combine';
import { huoQuXueYaunXinXi } from '../../services/xueyuan';
import BaoMingGouMaiStep from './xuyuanbaoming/BaoMingGouMaiStep';
import BaoMingJiBenXinXiStep from './xuyuanbaoming/BaoMingJiBenXinXiStep';
import BaoMingJieSuanStep from './xuyuanbaoming/xuyuanjiesuan/BaoMingJieSuanStep';

const { Step } = Steps;

type XueYuanBaoMingParamType = {
    xueYuanId: string
}

/**
 * 保存了，【学员信息】 && 【购买项目】 && 【费用结算】三个页面中的信息
 */
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

    // 学员课程有效期（选择多个学员课程时，共用一个有效期）
    @observable
    keChengYouXiaoQi: number | null = null;

    // 缴费记录 - 第一个缴费历史（一个缴费记录有可能多次缴费，这里是第一次缴费历史）
    @observable
    jiaoFeiLiShi: JiaoFeiLiShi | undefined = undefined;

    // 缴费记录 - 跟进人Id
    @observable
    genJinRenId: string | undefined;

    @action
    setXueYuanId = (id: string): void => {
        this.xueYuanId = id;
    }

    /**
     * 设置选择的课程
     * @param list 
     */
    @observable
    setXueYuanKeChengList = (list: XueYuanKeCheng[]) => {
        this.xueYuanKeChengList = list;
    }

    /**
     * 设置当前学员信息
     * @param xueYuanXinXi 当前选择的，系统中存在的学员信息，或者系统中不存在的新的学员信息
     */
    @action
    setXueYuanXinXi = (xueYuanXinXi: XueYuanXinXi | undefined) => {
        this.xueYuanXinXi = xueYuanXinXi;
    }

    /**
     * 设置学员课程有效期
     * @param v 学员课程有效期
     */
    @action
    setKeChengYouXiaoQi = (v: number | null) => {
        this.keChengYouXiaoQi = v;
    }

    /**
     * 设置缴费历史
     * @param jiaoFeiLiShi 缴费历史
     */
    @action
    setJiaoFeiLiShi = (jiaoFeiLiShi: JiaoFeiLiShi) => {
        this.jiaoFeiLiShi = jiaoFeiLiShi;
    }

    /**
     * 设置缴费记录跟进人
     * @param genJinRenId 缴费记录 - 跟进人Id
     */
    @action
    setGenJinRenId = (genJinRenId: string) => {
        this.genJinRenId = genJinRenId;
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

/**
 * 学员报名页面
 * @returns 
 */
const XueYuanBaoMing = () => {
    const history = useHistory();
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

    // 设置缴费记录 - 跟进人
    const getJiaoFenJiLuGenJinRen = (genJinRenId: string) => {
        viewStore.setGenJinRenId(genJinRenId);
    }

    // 设置缴费历史记录 - 这里为第一次缴费的记录
    const getJiaoFenLiShi = (liShi: JiaoFeiLiShi) => {
        viewStore.setJiaoFeiLiShi(liShi);
    }

    /**
     * 报名提交，从viewStore中获取所有信息（学员信息 && 购买项目 && 费用结算三个页面中的信息都存储到viewStore中），提交到后端接口
     */
    const onBaoMingSubmit = async () => {
        if (viewStore.xueYuanXinXi && viewStore.jiaoFeiLiShi) {
            try {
                await xueYuanBaoMing(viewStore.xueYuanXinXi, viewStore.xueYuanKeChengList, viewStore.jiaoFeiLiShi, viewStore.genJinRenId, viewStore.keChengYouXiaoQi);
                history.push(getDefinedRouteByRouteName(routeName.jiaofeijilu)?.path || '');
            } catch (e) { }
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
                                xueYuanKeChengList={viewStore.xueYuanKeChengList}
                                onPreviousStep={onPreviousStep}
                                getJiaoFenJiLuGenJinRen={getJiaoFenJiLuGenJinRen}
                                getJiaoFenLiShi={getJiaoFenLiShi}
                                onNextStep={onBaoMingSubmit}
                            /> : ""}
                    </Col>
                </Row>
            </Space>
        </div>
    )
}

export default observer(XueYuanBaoMing);
