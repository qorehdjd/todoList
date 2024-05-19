import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const TodoList = ({ todoList }: { todoList: { text: string } }) => {
  const [countValue, setCountValue] = useState(0);

  const onClickDecreaseCount = useCallback(() => {
    setCountValue(countValue - 1);
  }, [countValue]);

  const onClickIncreaseCount = useCallback(() => {
    setCountValue(countValue + 1);
  }, [countValue]);

  return (
    <div className='todoLists_wrapper'>
      <div>{todoList.text}</div>
      <div>
        <button onClick={onClickDecreaseCount}>-</button>
        <span>{countValue}</span>
        <button onClick={onClickIncreaseCount}>+</button>
      </div>
    </div>
  );
};

export default TodoList;
