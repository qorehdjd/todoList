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
import { logout } from '../../reducers/user';

const ScheduleLayout = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  .logout_wrapper {
    margin-top: 10px;
    text-align: center;
    button {
      background-color: green;
      color: white;
      border: none;
      width: 15rem;
      height: 5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 2rem;
      font-weight: 600;
    }
  }
  .fc {
    flex: 1;
    font-size: 2rem;
    overflow: scroll;
  }

  .fc-day-today {
    background-color: white;
  }
`;

const Schedule = () => {
  const dispatch = useDispatch<AppDispatch>();
  const didMount = useRef(false);

  const me = useSelector((state: RootState) => state.user.me);
  const lists = useSelector((state: RootState) => state.post.posts.lists);
  const dateLists = useSelector((state: RootState) => state.post.posts.dateLists);

  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (me) {
      dispatch(getLists());
    }
  }, [me, dispatch]);

  useEffect(() => {
    if (didMount.current) {
      dispatch(getLists());
    } else {
      didMount.current = true;
    }
  }, [dateLists, dispatch]);

  const onClickLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

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

  const ModifiedLists: any = useMemo(() => {
    return lists.map((list) => {
      const ModifiedTitle = list.items?.map((item) => {
        return item.title;
      });
      return { start: list.date, title: ModifiedTitle, color: 'green' };
    });
  }, [lists]);
  return (
    <>
      {me ? (
        <ScheduleLayout>
          {isOpenModal && <Todo onCloseModal={onCloseModal} />}
          <div className='logout_wrapper'>
            <button onClick={onClickLogout}>로그아웃</button>
          </div>
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
