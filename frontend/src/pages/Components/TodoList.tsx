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
  .title {
    font-size: 2rem;
  }
  .count_btn_wrapper {
    display: flex;
    align-items: center;
    .trash-can-icon {
      color: #ff0000;
      margin-left: 7px;
      cursor: pointer;
      font-size: 3rem;
    }
    button {
      background-color: green;
      color: white;
      border: 1px solid green;
      cursor: pointer;
      padding: 0.5rem 1.5rem;
      font-size: 2.5rem;
    }
    .count {
      margin: 0 5px;
      font-size: 2rem;
    }
  }
`;

const TodoList = ({
  list,
  onClickDeleteList,
}: {
  list: { title: string; count: number };
  onClickDeleteList: () => void;
}) => {
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
    onClickDeleteList();
  }, [list.title, dispatch, onClickDeleteList]);

  return (
    <>
      <TodoListLayout>
        <div className='title'>{list.title}</div>
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
    </>
  );
};

export default TodoList;
