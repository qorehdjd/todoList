import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { FaCheck } from 'react-icons/fa6';

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
  /* .fc-daygrid-event-harness {
    overflow: hidden;
  } */
  .fc-day-today {
    background-color: white;
  }
`;

const Schedule = () => {
  const dispatch = useDispatch<AppDispatch>();

  const me = useSelector((state: RootState) => state.user.me);
  const lists = useSelector((state: RootState) => state.post.posts.lists);

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
  console.log('lists', lists);
  const ModifiedLists = useMemo(() => {
    return lists.map((list) => {
      console.log(list);
      const ModifiedTitle = list.items?.map((item) => {
        return item.title;
      });
      return { start: list.date, title: ModifiedTitle, color: 'green' };
    });
  }, [lists]);
  console.log('Mo', ModifiedLists);
  return (
    <>
      {me ? (
        <ScheduleLayout>
          {isOpenModal && <Todo onCloseModal={onCloseModal} />}
          <h1>Demo App</h1>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            weekends={true}
            events={ModifiedLists}
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
  console.log('123', eventInfo);
  return (
    <>
      {eventInfo.event.title.split(',').map((tit) => (
        <div
          style={{
            borderBottom: '1px solid black',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 5px',
            alignItems: 'center',
          }}
          key={tit}
        >
          <FaCheck style={{ width: '20px', height: '20px', marginRight: '7px' }} />
          <span style={{ overflow: 'hidden', fontSize: '1.7rem' }}>{tit}</span>
        </div>
      ))}
    </>
  );
}

export default Schedule;
