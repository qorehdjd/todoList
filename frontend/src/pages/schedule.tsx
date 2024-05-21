import React, { useCallback, useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import Todo from './todo';
import styled from 'styled-components';
import postSlice, { getDateList, getLists } from '../../reducers/post';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import Login from './login';
import { EventContentArg } from '@fullcalendar/core/index.js';

// const events = [
//   { title: 'Meeting1', start: new Date('2024-5-29'), color: '#ad1457' },
//   { title: 'Meeting2', start: new Date('2024-5-30') },
//   { title: 'Meeting2', start: new Date('2024-5-10') },
//   { title: 'Meeting2', start: new Date('2024-5-13') },
//   { title: 'Meeting2', start: new Date('2024-5-15') },
//   { title: 'Meeting2', start: new Date('2024-5-18') },
// ];

const ScheduleLayout = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  .fc {
    flex: 1;
    font-size: 2rem;
    overflow: scroll;
  }
`;

const Schedule = () => {
  const dispatch = useDispatch<AppDispatch>();

  const me = useSelector((state: RootState) => state.user.me);

  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (me) {
      dispatch(getLists());
    }
  }, [me, dispatch]);

  const onClickDate = useCallback(
    async (e: DateClickArg) => {
      dispatch(postSlice.actions.reviseDate(e.dateStr));
      await dispatch(getDateList(e.dateStr));
      setIsOpenModal(true);
    },
    [dispatch],
  );

  const onCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  return (
    <>
      {me ? (
        <ScheduleLayout>
          {isOpenModal && <Todo onCloseModal={onCloseModal} />}
          <h1>Demo App</h1>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            weekends={false}
            // events={events}
            eventContent={renderEventContent}
            dateClick={onClickDate}
          />
        </ScheduleLayout>
      ) : (
        <Login />
      )}
    </>
  );
};

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default Schedule;
