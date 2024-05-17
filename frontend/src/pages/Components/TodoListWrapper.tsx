import React from 'react';
import styled from 'styled-components';
import TodoInput from './TodoInput';
import TodoList from './TodoList';

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  .entireContainer {
    width: 30%;
    height: 70%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border: 1px solid green;
    h1 {
      background-color: green;
      color: #fff;
      text-align: center;
      padding: 10px;
    }
  }
`;

const TodoListWrapper = () => {
  return (
    <HomeContainer>
      <div className='entireContainer'>
        <h1>TodoList</h1>
        <TodoInput />
        <TodoList />
      </div>
    </HomeContainer>
  );
};

export default TodoListWrapper;
