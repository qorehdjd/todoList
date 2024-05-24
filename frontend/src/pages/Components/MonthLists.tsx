import React, { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../../store';

const MonthListsLayout = styled.div`
  position: absolute;
  height: 100%;
  width: 100vw;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  .month-lists-wrapper {
    background-color: white;
    width: 30%;
    height: 70%;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 3rem;
      text-align: center;
      background-color: green;
      color: white;
      margin: 0;
      padding: 10px;
    }
    .month-lists {
      font-size: 2.3rem;
      font-weight: 600;
      margin-top: 12px;
      padding: 0 30px;
      overflow-y: scroll;
      flex: 1;
      li {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .month-lists-wrapper {
      width: 50%;
    }
  }
  @media screen and (max-width: 800px) {
    .month-lists-wrapper {
      width: 80%;
    }
  }
`;

const MonthLists = ({ onCloseMonthListsModal }: { onCloseMonthListsModal: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const monthLists = useSelector((state: RootState) => state.post.monthLists);
  const month = useSelector((state: RootState) => state.post.month);

  const onClosePopup = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (modalRef.current && !modalRef.current.contains(e.target as HTMLElement)) onCloseMonthListsModal();
    },
    [onCloseMonthListsModal],
  );
  return (
    <MonthListsLayout onClick={onClosePopup}>
      <div className='month-lists-wrapper' ref={modalRef}>
        <h1 className='title'>{month}월 일정</h1>
        <ul className='month-lists'>
          {monthLists.map((list) => {
            return (
              <li key={list.title}>
                <div>{list.title}</div>
                <div>{list.count}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </MonthListsLayout>
  );
};

export default MonthLists;
