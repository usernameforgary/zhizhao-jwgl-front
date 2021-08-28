import React from 'react';
import { useHistory } from 'react-router-dom';
import { Result, Button } from 'antd';

const Page404 = () => {
    const history = useHistory();
    return (
        <Result
            status={404}
            title="Comming soon..."
            subTitle="抱歉, 未找到或开发中."
            extra={
                <Button type="primary" onClick={() => history.push('/sys')}>
                    返回首页
                </Button>
            }
        />
    )
}

export default Page404;
