import React, { SetStateAction, useCallback, useState, Dispatch } from 'react';
import styled from 'styled-components';
import { BiSolidTrash } from 'react-icons/bi';

import postSlice from '../../../reducers/post';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';

const TodoListLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.8rem;
  margin-bottom: 12px;
  .count_btn_wrapper {
    display: flex;
    align-items: center;
    .trash-can-icon {
      color: #ff0000;
      margin-left: 7px;
      cursor: pointer;
    }
    button {
      background-color: green;
      color: white;
      border: 1px solid green;
      padding: 4px 8px;
      cursor: pointer;
    }
    .count {
      margin: 0 5px;
    }
  }
`;

const dummyData = [
  {
    title: '강아지랑 놀기',
    count: 2,
  },
  {
    title: '물건 정리하기',
    count: 2,
  },
  {
    title: '턱걸이 하기',
    count: 7,
  },
  {
    title: '환자들 진단하기',
    count: 10,
  },
  {
    title: '컴퓨터 조립하기',
    count: 18,
  },
  {
    title: '키보드 부품 가지러가기',
    count: 20,
  },
];

const TodoList = ({ list }: { list: { title: string; count: number } }) => {
  const dispatch = useDispatch<AppDispatch>();

  const onClickDecreaseCount = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      dispatch(postSlice.actions.decreaseCount(list.title));
    },
    [list.title, dispatch],
  );

  const onClickIncreaseCount = useCallback(() => {
    dispatch(postSlice.actions.increaseCount(list.title));
  }, [list.title, dispatch]);

  const onDeleteList = useCallback(() => {
    dispatch(postSlice.actions.deleteList(list.title));
  }, [list.title, dispatch]);

  return (
    <TodoListLayout>
      <div>{list.title}</div>
      <div className='count_btn_wrapper'>
        <button className='decrease_btn' onClick={onClickDecreaseCount}>
          -
        </button>
        <span className='count'>{list.count}</span>
        <button className='increase_btn' onClick={onClickIncreaseCount}>
          +
        </button>
        <BiSolidTrash className='trash-can-icon' onClick={onDeleteList} />
      </div>
    </TodoListLayout>
  );
};

export default TodoList;
