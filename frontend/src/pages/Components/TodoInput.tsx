import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import styled from 'styled-components';

const TodoInputContainer = styled.div`
  border-bottom: 1px solid green;
  padding: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    width: 100%;
    border: none;
    border-bottom: 1px solid green;
    &:focus {
      outline: none;
    }
  }
  button {
    background-color: green;
    color: white;
    font-weight: 900;
    border: none;
    padding: 10px;
    width: 10%;
    cursor: pointer;
    &:active {
      box-shadow: inset -0.3rem -0.1rem 1.4rem #fbfbfb, inset 0.3rem 0.4rem 0.8rem #bec5d0;
      cursor: pointer;
    }
  }
`;

const TodoInput = ({
  todoLists,
  setTodoLists,
}: {
  todoLists: { text: string }[];
  setTodoLists: Dispatch<SetStateAction<{ text: string }[]>>;
}) => {
  const [text, setText] = useState('');

  const onChangeText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const onClick = useCallback(() => {
    setTodoLists([...todoLists, { text }]);
  }, [setTodoLists, todoLists, text]);

  return (
    <TodoInputContainer>
      <input type='text' placeholder='할일을 입력해주세요' value={text} onChange={onChangeText} />
      <button onClick={onClick}>+</button>
    </TodoInputContainer>
  );
};
export default TodoInput;
