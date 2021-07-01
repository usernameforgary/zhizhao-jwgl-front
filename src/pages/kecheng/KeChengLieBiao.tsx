import { Button, Row, Col, Space } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import SearchItemInput from '../../components/searchitems/searchiteminput/SearchItemInput';

export type KeChengLieBiaoProps = {

}

const KeChengLieBiao: React.FC<KeChengLieBiaoProps> = () => {
    const history = useHistory();

    return (
        <>
            <Space direction="vertical">

                <Row>
                    <SearchItemInput></SearchItemInput>
                </Row>
                <Row>
                    <Button onClick={() => { history.push("/sys/xinjiankecheng") }}>新建课程</Button>
                </Row>
                <Row>
                    <div>
                        ke cheng list
                    </div>
                </Row>
            </Space>
        </>
    )
}

export default KeChengLieBiao
