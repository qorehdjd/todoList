import React from 'react';
import TodoListWrapper from './Components/TodoListWrapper';
import styled from 'styled-components';

const TodoLayout = styled.div`
  position: absolute;
  height: 100%;
  width: 100vw;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Todo = ({ onCloseModal }: { onCloseModal: () => void }) => {
  return (
    <TodoLayout>
      <TodoListWrapper onCloseModal={onCloseModal} />
    </TodoLayout>
  );
};

export default Todo;
