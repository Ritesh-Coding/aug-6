import React, { useEffect, useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { useMemo } from 'react';
import styled from 'styled-components';
import CalenderHolidays from '../UI/CalenderHolidays';
import "./page.css";

const Nav = styled.div`
  background: #FFFFFF;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

interface LeaveEvent {
  date: string;
  first_name: string;
}

interface BirthdayEvent {
  dob: string;
  first_name: string;
}

const Calender: React.FC = () => {
  const localizer = momentLocalizer(moment);
  const [data, setData] = useState<LeaveEvent[]>([]);
  const [birthdayData, setBirthdayData] = useState<BirthdayEvent[]>([]);
  const [calenderType, setCalenderType] = useState<string>("leaveCalender");

  const axiosInstance = useAxios();

  const fetchCalenderData = (calenderType: string) => {
    if (calenderType === "leaveCalender") {
      const calenderBtn = document.getElementById("calenderBtn");
      const birthdayBtn = document.getElementById("birthdayBtn");

      if (calenderBtn) calenderBtn.style.opacity = "1";
      if (birthdayBtn) birthdayBtn.style.opacity = "0.5";

      axiosInstance.get(`calender-leaves/?status=Approved`).then((res) => {
        setData(res.data);
      });
    } else if (calenderType === "birthDayCalender") {
      const calenderBtn = document.getElementById("calenderBtn");
      const birthdayBtn = document.getElementById("birthdayBtn");

      if (calenderBtn) calenderBtn.style.opacity = "0.5";
      if (birthdayBtn) birthdayBtn.style.opacity = "1";

      axiosInstance.get(`api/calender-birthdays/`).then((res) => {
        setBirthdayData(res.data);
      });
    }
  };

  useEffect(() => {
    fetchCalenderData(calenderType);
  }, [calenderType]);

  const eventList = data.map((leaves) => ({
    start : leaves.date,
    end: leaves.date,
    title: leaves.first_name,
  }));

  const birthDayEventList = birthdayData.map((birthday) => ({
    start: birthday.dob,
    end: birthday.dob,
    title: birthday.first_name,
  }));

  const { views } = useMemo(() => ({
    views: {
      month: true,
    },
  }), []);

  let calendarShow;
  switch (calenderType) {
    case "leaveCalender":
      calendarShow = (
        <Calendar
          selectable
          defaultView="month"
          views={views}
          defaultDate={new Date()}
          localizer={localizer}
          events={eventList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      );
      break;
    case "birthDayCalender":
      calendarShow = (
        <Calendar
          selectable
          defaultView="month"
          views={views}
          defaultDate={new Date()}
          localizer={localizer}
          events={birthDayEventList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      );
      break;
    default:
      calendarShow = null;
  }

  return (
    <>
      <Nav>
        <div className="navbar">
          <button className="btn btn-success" id="calenderBtn" onClick={() => setCalenderType("leaveCalender")}>Leave Calender</button>
          <button className="btn btn-success" id="birthdayBtn" onClick={() => setCalenderType("birthDayCalender")}>BirthDay Calender</button>
        </div>
      </Nav>
      <div className='calender'>
        <div style={{ marginLeft: '260px', marginTop: '40px', width: '60%' }}>
          {calendarShow}
        </div>
        <div>
          <CalenderHolidays />
        </div>
      </div>
    </>
  );
};

export default Calender;