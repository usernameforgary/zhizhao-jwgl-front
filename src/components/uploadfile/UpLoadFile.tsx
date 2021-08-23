import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Upload, Button } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadOutlined } from '@ant-design/icons';

const UpLoadFile = () => {
    return (
        <div>
            <Upload
            >
                <Button icon={<UploadOutlined />}>上传</Button>
            </Upload>
        </div>
    )
}

export default UpLoadFile
