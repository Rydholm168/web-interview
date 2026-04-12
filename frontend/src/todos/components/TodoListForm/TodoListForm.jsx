import React, { useRef, useCallback } from 'react'
import { Box, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useMutation } from '@apollo/client/react'
import { GET_TODO_LISTS, ADD_TODO, UPDATE_TODO, DELETE_TODO } from '../../graphql'
import { TodoRow } from './TodoRow/TodoRow'
import { useDebouncedSave } from './useDebouncedSave'

const refetchTodoLists = [{ query: GET_TODO_LISTS }]

export const TodoListForm = ({ todoList }) => {
  const newTodoId = useRef(null)
  const { status: saveStatus, save, cancel: cancelDebounce } = useDebouncedSave()

  const [addTodo] = useMutation(ADD_TODO, {
    refetchQueries: refetchTodoLists,
    onCompleted: (data) => {
      newTodoId.current = data.addTodo.id
    },
  })
  const [updateTodo] = useMutation(UPDATE_TODO, { refetchQueries: refetchTodoLists })
  const [deleteTodo] = useMutation(DELETE_TODO, { refetchQueries: refetchTodoLists })

  const debouncedUpdate = useCallback(
    (todoId, fields) =>
      save(todoId, () =>
        updateTodo({ variables: { todoListId: todoList.id, todoId, ...fields } }),
      ),
    [save, updateTodo, todoList.id],
  )

  return (
    <Box sx={sectionStyle}>
      <Typography component='h2' sx={headingStyle}>
        {todoList.title}
      </Typography>
      <Box sx={listStyle}>
        {todoList.todos.map((todo, index) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            index={index}
            isLast={index === todoList.todos.length - 1}
            todoListId={todoList.id}
            saveStatus={saveStatus[todo.id]}
            newTodoIdRef={newTodoId}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            debouncedUpdate={debouncedUpdate}
            cancelDebounce={cancelDebounce}
          />
        ))}
        <Box sx={addRowStyle}>
          <Button
            sx={addButtonStyle}
            onClick={() => addTodo({ variables: { todoListId: todoList.id, text: '' } })}
          >
            Add Todo <AddIcon sx={addIconStyle} />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

const sectionStyle = {
  padding: '1.5rem 0 0',
}

const headingStyle = {
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  color: 'rgb(38, 38, 38)',
  display: '-webkit-box',
  fontFamily: 'ballinger, sans-serif',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '24px',
  margin: 0,
  marginBottom: '1rem',
  overflow: 'hidden',
}

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}

const addRowStyle = {
  paddingTop: '1rem',
}

const addButtonStyle = {
  alignSelf: 'flex-start',
  color: '#111111',
  fontFamily: 'ballinger, sans-serif',
  fontSize: '1rem',
  fontWeight: 500,
  paddingInline: 0,
  textTransform: 'none',
  '&:hover': { backgroundColor: 'transparent' },
}

const addIconStyle = {
  marginLeft: '0.25rem',
}
