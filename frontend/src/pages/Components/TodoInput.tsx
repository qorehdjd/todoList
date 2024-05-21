import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AppDispatch } from '../../../store';
import postSlice from '../../../reducers/post';

const TodoInputContainer = styled.form`
  border-bottom: 1px solid green;
  padding: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  input {
    width: 100%;
    border: none;
    border-bottom: 1px solid green;
    font-size: 2rem;

    &:focus {
      outline: none;
    }
  }
  input::placeholder {
    font-weight: 600;
    font-size: 1.6rem;
  }
  button {
    background-color: green;
    color: white;
    font-weight: 600;
    border: none;
    width: 15%;
    cursor: pointer;
    font-size: 5rem;
    &:active {
      box-shadow: inset -0.3rem -0.1rem 1.4rem #fbfbfb, inset 0.3rem 0.4rem 0.8rem #bec5d0;
      cursor: pointer;
    }
  }
`;

const TodoInput = () => {
  const dispatch = useDispatch<AppDispatch>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (title === '') {
        alert('내용을 입력해주세요');
        inputRef.current?.focus();
        return;
      }
      dispatch(postSlice.actions.addlist({ title, count: 0 }));
      setTitle('');
    },
    [title, dispatch],
  );

  const onChangeText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  return (
    <TodoInputContainer onSubmit={onSubmit}>
      <input type='text' placeholder='할일을 입력해주세요' value={title} onChange={onChangeText} ref={inputRef} />
      <button>+</button>
    </TodoInputContainer>
  );
};
export default TodoInput;
