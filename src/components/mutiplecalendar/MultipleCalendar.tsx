import React, { useEffect, useState } from 'react'
import { Calendar, Row, Col } from 'antd'
import moment, { Moment } from 'moment'

import './multiplecalendar.css'
import { HeaderRender } from 'antd/lib/calendar/generateCalendar'

type MultipleCalendarProps = {
    initialDates?: number[],
    onDatesChange: (dates: number[]) => void
}

const MultipleCalendar: React.FC<MultipleCalendarProps> = ({ initialDates, onDatesChange }) => {
    const [dateValues, setDateValues] = useState<number[]>(initialDates || []);
    const [showValue, setShowValue] = useState<Moment>(moment());

    // 点击选择日期回调
    const handleOnSelect = (selectedDate: Moment) => {
        const selectedValue: number = selectedDate.valueOf();
        const index = dateValues.findIndex(e => selectedDate.isSame(moment(e), "day"));
        const temp = [...dateValues];

        if (index !== -1) {
            temp.splice(index, 1);
        } else {
            temp.push(selectedValue);
        }

        setDateValues(temp);
        onDatesChange(temp);
    }

    // 自定义渲染日期单元格，返回内容覆盖单元格
    const handleFullCellRender = (current: Moment) => {

        if (dateValues.some(e => current.isSame(moment(e), "day"))) {
            return <div className={"calendar-date selectedDate"}>{current.format("DD")}</div>;
        }

        // 今天
        if (current.isSame(new Date(), "day")) {
            return <div className={"calendar-date calendar-today"}>{current.format("DD")}</div>;
        }

        return <div className={"calendar-date"}>{current.format("DD")}</div>;
    }

    // 自定义头部内容
    const handleHeaderRender: HeaderRender<Moment> = ({ value, type, onChange, onTypeChange }) => {
        return (
            <div>
                <Row justify="space-around" align="middle" style={{ height: "35px" }}>
                    <Col span={4} className={"calendar-header-menu"}>
                        <div onClick={(e) => {
                            const newValue = showValue.clone();
                            setShowValue(newValue.add(-1, "M"));
                        }}>上月</div>
                    </Col>
                    <Col>
                        {showValue.format("YYYY年MM月")}
                    </Col>
                    <Col span={4} className={"calendar-header-menu"}>
                        <span onClick={(e) => {
                            setShowValue(moment());
                        }}>本月</span>
                    </Col>
                    <Col span={4} className={"calendar-header-menu"}>
                        <span onClick={(e) => {
                            const newValue = showValue.clone();
                            setShowValue(newValue.add(1, "M"));
                        }
                        }>下月</span>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <>
            <Calendar
                value={showValue}
                fullscreen={false}
                className={"calendar"}
                dateFullCellRender={handleFullCellRender}
                onSelect={handleOnSelect}
                headerRender={handleHeaderRender}
            />
        </>
    )
}

export default MultipleCalendar
