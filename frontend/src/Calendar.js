import React, { useState, useEffect } from "react";
import "./calendar.css";

export default function Calendar({ onSelect, activeDate }) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(() => activeDate ? new Date(activeDate).getMonth() : today.getMonth());
    const [currentYear, setCurrentYear] = useState(() => activeDate ? new Date(activeDate).getFullYear() : today.getFullYear());

    useEffect(() => {
        if (activeDate) {
            const d = new Date(activeDate);
            if (!isNaN(d.getTime())) {
                setCurrentMonth(d.getMonth());
                setCurrentYear(d.getFullYear());
            }
        }
    }, [activeDate]);

    const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const totalDays = daysInMonth(currentYear, currentMonth);
    const startOffset = firstDayOfMonth(currentYear, currentMonth);

    const handlePrevMonth = () => {
        setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
        if (currentMonth === 0) setCurrentYear((y) => y - 1);
    };
    const handleNextMonth = () => {
        setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
        if (currentMonth === 11) setCurrentYear((y) => y + 1);
    };
    const handleSelect = (day) => {
        const selectedDate = new Date(currentYear, currentMonth, day);
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(selectedDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${d}`;
        
        onSelect && onSelect(dateString);
    };

    const renderDays = () => {
        const cells = [];
        
        // 1. Ô trống đầu tháng (Start Offset)
        for (let i = 0; i < startOffset; i++) {
            cells.push(<div key={"blank-start-"+i} className="day blank"></div>);
        }
        
        // 2. Các ngày trong tháng
        for (let day = 1; day <= totalDays; day++) {
            const checkMonth = String(currentMonth + 1).padStart(2, '0');
            const checkDay = String(day).padStart(2, '0');
            const currentString = `${currentYear}-${checkMonth}-${checkDay}`;
            const isSelected = activeDate === currentString;
            const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
            
            cells.push(
                <div key={day} 
                     className={`day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`} 
                     onClick={() => handleSelect(day)}>
                    {day}
                </div>
            );
        }

        // 3. THÊM LOGIC: Ô trống cuối tháng (End Offset)
        const totalCellsRendered = startOffset + totalDays;
        const daysInLastRow = totalCellsRendered % 7;
        
        // Tính số ô cần điền để kết thúc hàng cuối cùng
        const endOffset = daysInLastRow === 0 ? 0 : 7 - daysInLastRow;

        for (let i = 0; i < endOffset; i++) {
            cells.push(<div key={`blank-end-${i}`} className="day blank"></div>);
        }
        
        return cells;
    };

    return (
        <div className="calendar">
            <div className="header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <span>{`Tháng ${currentMonth + 1} / ${currentYear}`}</span>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="weekdays">{weekDays.map(d => <div key={d} className="weekday">{d}</div>)}</div>
            <div className="grid">{renderDays()}</div>
        </div>
    );
}