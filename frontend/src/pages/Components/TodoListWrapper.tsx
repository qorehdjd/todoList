import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { saveData } from '../../../reducers/post';

const TodoListLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .entireContainer {
    width: 30%;
    height: 70%;
    display: flex;
    flex-direction: column;
    border: 1px solid green;
    position: relative;
    h1 {
      background-color: #008000;
      color: #fff;
      text-align: center;
      padding: 10px;
      margin: 0;
      span {
        position: relative;
        top: 1px;
      }
    }
    .todoLists_wrapper {
      display: flex;
      flex-direction: column;
      padding: 5px 20px;
      background-color: #fff;
      height: 100%;
      overflow-y: scroll;
    }
    .save_btn_wrapper {
      position: absolute;
      left: 50%;
      bottom: 5px;
      transform: translate(-50%);
      button {
        background-color: #008000;
        color: #ffffff;
        border: 1px solid #008000;
        padding: 5px 20px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .entireContainer {
      width: 50%;
    }
  }
  @media screen and (max-width: 800px) {
    .entireContainer {
      width: 80%;
    }
  }
`;

export interface TodoList {
  title: string;
  count: number;
}

const obj = {
  '2024-05-24': [
    { title: 'hi', count: 0 },
    { title: 'good', count: 5 },
  ],
  '2024-07-20': [
    { title: 'hi', count: 0 },
    { title: 'good', count: 5 },
  ],
};

const TodoListWrapper = ({ onCloseModal }: { onCloseModal: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const date = useSelector((state: RootState) => state.post.date);
  const lists = useSelector((state: RootState) => state.post.lists);

  const onClosePopup = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (modalRef.current && !modalRef.current.contains(e.target as HTMLElement)) onCloseModal();
    },
    [onCloseModal],
  );

  const onSaveData = useCallback(() => {
    const data = {
      lists,
      date,
    };
    dispatch(saveData(data));
  }, [dispatch, lists, date]);

  return (
    <TodoListLayout onClick={onClosePopup}>
      <div className='entireContainer' ref={modalRef}>
        <h1>
          {date} <span>일정표</span>
        </h1>
        <TodoInput />
        <div className='todoLists_wrapper'>
          {lists?.map((list) => (
            <TodoList key={list.title} list={list} />
          ))}
        </div>
        <div className='save_btn_wrapper'>
          <button onClick={onSaveData}>저장하기</button>
        </div>
      </div>
    </TodoListLayout>
  );
};

export default TodoListWrapper;
