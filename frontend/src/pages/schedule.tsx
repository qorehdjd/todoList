import React, { useCallback, useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import Todo from './todo';
import styled from 'styled-components';
import postSlice from '../../reducers/post';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import axios from 'axios';

const events = [{ title: 'Meeting', start: new Date() }];

const ScheduleLayout = styled.div`
  height: 100vh;
  position: relative;
`;

const Schedule = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const onClickDate = useCallback(
    (e: DateClickArg) => {
      dispatch(postSlice.actions.reviseDate(e.dateStr));
      setIsOpenModal(true);
    },
    [dispatch],
  );

  const onCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  return (
    <ScheduleLayout>
      {isOpenModal && <Todo onCloseModal={onCloseModal} />}
      <h1>Demo App</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        weekends={false}
        events={events}
        eventContent={renderEventContent}
        dateClick={onClickDate}
      />
    </ScheduleLayout>
  );
};

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default Schedule;
