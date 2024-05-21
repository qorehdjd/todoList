import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { saveList } from '../../../reducers/post';

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
        padding: 10px 30px;
        font-size: 2rem;
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

const TodoListWrapper = ({ onCloseModal }: { onCloseModal: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const didMount = useRef(false);

  const [isDeleteList, setIsDeleteList] = useState(false); // list가 아무것도 없을 때 저장되지 않게 하는것과 list 1개 삭제해서 list가 비어있을 때 저장되는 것을 구분

  const date = useSelector((state: RootState) => state.post.date);
  const dateLists = useSelector((state: RootState) => state.post.posts.dateLists);
  const saveListDone = useSelector((state: RootState) => state.post.saveListDone);

  useEffect(() => {
    if (didMount.current) {
      if (saveListDone) {
        setIsDeleteList(false);
        alert('저장 완료');
      }
    } else {
      didMount.current = true;
    }
  }, [saveListDone]);

  const onClosePopup = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (modalRef.current && !modalRef.current.contains(e.target as HTMLElement)) onCloseModal();
    },
    [onCloseModal],
  );

  const onSaveList = useCallback(() => {
    if (dateLists.length === 0 && !isDeleteList) return;
    const data = {
      dateLists,
      date,
    };
    dispatch(saveList(data));
  }, [dispatch, dateLists, date, isDeleteList]);

  const onClickDeleteList = useCallback(() => {
    setIsDeleteList(true);
  }, []);

  return (
    <TodoListLayout onClick={onClosePopup}>
      <div className='entireContainer' ref={modalRef}>
        <h1>
          {date} <span>일정표</span>
        </h1>
        <TodoInput />
        <div className='todoLists_wrapper'>
          {dateLists?.map((list) => (
            <TodoList key={list.title} list={list} onClickDeleteList={onClickDeleteList} />
          ))}
        </div>
        <div className='save_btn_wrapper'>
          <button onClick={onSaveList}>저장하기</button>
        </div>
      </div>
    </TodoListLayout>
  );
};

export default TodoListWrapper;
