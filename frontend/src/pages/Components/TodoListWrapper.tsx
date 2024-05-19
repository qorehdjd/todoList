import React, { useCallback, useState } from 'react';
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
    display: flex;
    flex-direction: column;
    border: 1px solid green;
    h1 {
      background-color: green;
      color: #fff;
      text-align: center;
      padding: 10px;
      margin: 0;
    }
    .todoLists_wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 20px;
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

export interface Todo {
  text: string;
}

const TodoListWrapper = () => {
  const [todoLists, setTodoLists] = useState<Todo[]>([]);

  return (
    <HomeContainer>
      <div className='entireContainer'>
        <h1>일정표</h1>
        <TodoInput todoLists={todoLists} setTodoLists={setTodoLists} />
        {todoLists.map((todoList) => (
          <TodoList key={todoList.text} todoList={todoList} />
        ))}
      </div>
    </HomeContainer>
  );
};

export default TodoListWrapper;
