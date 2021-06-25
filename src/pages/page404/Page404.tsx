import React from 'react';
import { useHistory } from 'react-router-dom';
import { Result, Button } from 'antd';

const Page404 = () => {
    const history = useHistory();
    return (
        <Result
            status={404}
            title="404"
            subTitle="抱歉, 您所访问的页面不存在."
            extra={
                <Button type="primary" onClick={() => history.push('/sys')}>
                    返回首页
                </Button>
            }
        />
    )
}

export default Page404;
