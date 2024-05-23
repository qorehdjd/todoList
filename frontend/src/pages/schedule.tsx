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
import { EventClickArg, EventContentArg } from '@fullcalendar/core/index.js';
import { FaCheck } from 'react-icons/fa6';
import { logout } from '../../reducers/user';

const ScheduleLayout = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  .logout_wrapper {
    margin: 5px 0 15px 0;
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
  .list-item {
    background-color: green;
    border-radius: 4px;
    margin-bottom: 2px;
    cursor: pointer;
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

  const onClickDateItem = useCallback(
    async (e: EventClickArg) => {
      dispatch(postSlice.actions.reviseDate(e.event.startStr));
      await dispatch(getDateList(e.event.startStr));
      setIsOpenModal(true);
    },
    [dispatch],
  );

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <>
        {eventInfo.event.title
          .split(',')
          .slice(0, 3) // 달력에 list 3개까지만 표시
          .map((tit) => (
            <div
              className='list-item'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 5px',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              key={tit}
            >
              <FaCheck style={{ width: '2rem', height: '2rem', marginRight: '7px' }} />
              <span style={{ overflow: 'hidden', fontSize: '1.7rem', flex: '1' }}>{tit}</span>
            </div>
          ))}
      </>
    );
  };

  const onCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const ModifiedLists: any = useMemo(() => {
    return lists.map((list) => {
      const ModifiedTitle = list.items?.map((item) => {
        return item.title;
      });
      return { start: list.date, title: ModifiedTitle, color: 'white', backgroundColor: 'white', textColor: 'white' };
    });
  }, [lists]);

  // 전체 데이터 가져오기 알고리즘
  const data = lists
    .map((list) => {
      const data = list.items.map((item) => {
        return { title: item.title, count: item.count };
      });
      return data;
    })
    .flat();

  const answer = {};

  for (let key in data) {
    if (answer[data[key].title]) {
      answer[data[key].title] += data[key].count;
    } else {
      answer[data[key].title] = data[key].count;
    }
  }

  const finalData = [];

  for (let key in answer) {
    console.log('answer', answer);
    console.log('key', key);
    finalData.push({ title: key, count: answer[key] });
  }

  console.log('answer', finalData);

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
            eventClick={onClickDateItem}
          />
        </ScheduleLayout>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Schedule;
