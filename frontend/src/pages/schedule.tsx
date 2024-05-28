import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import Todo from './todo';
import styled from 'styled-components';
import moment from 'moment';
import postSlice, { getDateList, getLists, getMonthLists } from '../../reducers/post';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import Login from './login';
import { EventClickArg, EventContentArg } from '@fullcalendar/core/index.js';
import { FaCheck } from 'react-icons/fa6';
import { logout } from '../../reducers/user';
import MonthLists from './Components/MonthLists';
import axios from 'axios';

const ScheduleLayout = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  .logout_wrapper {
    margin: 5px 0 15px 0;
    text-align: right;
    margin-right: 20px;
    button {
      background-color: green;
      color: white;
      border: none;
      width: 13rem;
      height: 4rem;
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

const monthLists: any = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};

const Schedule = () => {
  const dispatch = useDispatch<AppDispatch>();
  const didMount = useRef(false);

  const me = useSelector((state: RootState) => state.user.me);
  const lists = useSelector((state: RootState) => state.post.posts.lists);
  const dateLists = useSelector((state: RootState) => state.post.posts.dateLists);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isClickMonthLists, setIsClickMonthLists] = useState(false);

  useEffect(() => {
    if (me) {
      (async () => {
        await dispatch(getLists());
        dispatch(postSlice.actions.reviseDate(moment().format('YYYY-MM-DD')));
        await dispatch(getDateList(moment().format('YYYY-MM-DD')));
        setIsOpenModal(true);
      })();
    }
  }, [me, dispatch]);

  useEffect(() => {
    // date에서 일정을 추가하거나 삭제했을 때 리렌더링 될 수 있도록
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
      console.log('eee', e);
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
          .map((tit) => {
            if (!tit) return null;
            return (
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
            );
          })}
      </>
    );
  };

  const onCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const onCloseMonthListsModal = useCallback(() => {
    setIsClickMonthLists(false);
  }, []);

  const ModifiedLists: any = useMemo(() => {
    return lists.map((list) => {
      const ModifiedTitle = list.items?.map((item) => {
        if (item.count === 0) return null;
        return item.title;
      });
      return { start: list.date, title: ModifiedTitle, color: 'white', backgroundColor: 'white', textColor: 'white' };
    });
  }, [lists]);

  return (
    <>
      {me ? (
        <ScheduleLayout>
          {isOpenModal && <Todo onCloseModal={onCloseModal} />}
          {isClickMonthLists && <MonthLists onCloseMonthListsModal={onCloseMonthListsModal} />}
          <div className='logout_wrapper'>
            <button onClick={onClickLogout}>로그아웃</button>
          </div>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            customButtons={{
              myCustomButton: {
                text: 'month lists',
                click: function (e) {
                  const month = document.querySelector('.fc-toolbar-title')?.textContent?.split(' ');
                  if (month) {
                    (async () => {
                      const data = month[1] + '-' + monthLists[month[0]]; // 2024-05
                      await dispatch(getMonthLists(data));
                      setIsClickMonthLists(true);
                    })();
                  }
                },
              },
            }}
            headerToolbar={{
              start: 'myCustomButton', // will normally be on the left. if RTL, will be on the right
              center: 'title',
              end: 'prev,next', // will normally be on the right. if RTL, will be on the left
            }}
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
