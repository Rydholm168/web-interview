import React, { useRef, useCallback, useEffect, useState } from 'react'
import {
  TextField,
  Box,
  Button,
  Typography,
  Checkbox,
  Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useMutation } from '@apollo/client/react'
import { GET_TODO_LISTS, ADD_TODO, UPDATE_TODO, DELETE_TODO } from '../graphql'

const refetchTodoLists = [{ query: GET_TODO_LISTS }]

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

const textFieldStyle = {
  '& .MuiInputLabel-root': {
    color: '#7b756d',
    fontSize: '0.9rem',
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '1rem',
    paddingBlock: '14px',
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    '& fieldset': { borderColor: '#d8d0c3' },
    '&:hover fieldset': { borderColor: '#bfb6a8' },
    '&.Mui-focused fieldset': { borderColor: '#262626', borderWidth: '1px' },
  },
}

const secondaryFieldStyle = {
  ...textFieldStyle,
  minWidth: '170px',
  '& .MuiOutlinedInput-input': {
    fontSize: '0.95rem',
    paddingBlock: '13px',
  },
}

const getRemainingText = (dueDate) => {
  if (!dueDate) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const due = new Date(dueDate + 'T00:00:00')
  const diffMs = due - now
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return { text: 'Due today', color: 'warning' }
  if (diffDays > 0)
    return { text: `${diffDays} day${diffDays === 1 ? '' : 's'} left`, color: 'default' }
  const overdue = Math.abs(diffDays)
  return { text: `Overdue by ${overdue} day${overdue === 1 ? '' : 's'}`, color: 'error' }
}

export const TodoListForm = ({ todoList }) => {
  const debounceTimers = useRef({})
  const [saveStatus, setSaveStatus] = useState({})

  const [addTodo] = useMutation(ADD_TODO, { refetchQueries: refetchTodoLists })
  const [updateTodo] = useMutation(UPDATE_TODO, { refetchQueries: refetchTodoLists })
  const [deleteTodo] = useMutation(DELETE_TODO, { refetchQueries: refetchTodoLists })

  useEffect(() => {
    const timers = debounceTimers.current
    return () => Object.values(timers).forEach(clearTimeout)
  }, [])

  const debouncedUpdate = useCallback(
    (todoListId, todoId, fields) => {
      if (debounceTimers.current[todoId]) {
        clearTimeout(debounceTimers.current[todoId])
      }
      setSaveStatus((prev) => ({ ...prev, [todoId]: 'saving' }))
      debounceTimers.current[todoId] = setTimeout(() => {
        updateTodo({ variables: { todoListId, todoId, ...fields } })
          .then(() => setSaveStatus((prev) => ({ ...prev, [todoId]: 'saved' })))
          .catch(() => setSaveStatus((prev) => ({ ...prev, [todoId]: 'error' })))
        delete debounceTimers.current[todoId]
      }, 300)
    },
    [updateTodo],
  )

  return (
    <Box sx={sectionStyle}>
      <Typography component='h2' sx={headingStyle}>
        {todoList.title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todoList.todos.map((todo, index) => {
            const remaining = getRemainingText(todo.dueDate)
            return (
              <Box
                key={todo.id}
                sx={{
                  borderBottom:
                    index === todoList.todos.length - 1 ? 'none' : '1px solid #f0ece5',
                  display: 'grid',
                  gap: '0.875rem',
                  gridTemplateColumns: {
                    xs: 'auto auto minmax(0, 1fr)',
                    md: 'auto auto minmax(0, 1fr) auto',
                  },
                  gridTemplateRows: { xs: 'auto auto', md: 'auto' },
                  paddingBlock: '0.875rem',
                  width: '100%',
                }}
              >
                <Typography
                  sx={{
                    alignSelf: 'center',
                    color: '#5f5a52',
                    fontFamily: 'ballinger, sans-serif',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    minWidth: '1.5rem',
                  }}
                >
                  {index + 1}
                </Typography>
                <Checkbox
                  checked={todo.completed}
                  sx={{
                    alignSelf: 'center',
                    color: '#8a857d',
                    padding: '4px',
                    '&.Mui-checked': { color: '#262626' },
                  }}
                  onChange={() =>
                    updateTodo({
                      variables: {
                        todoListId: todoList.id,
                        todoId: todo.id,
                        completed: !todo.completed,
                      },
                    })
                  }
                />
                <TextField
                  sx={{
                    ...textFieldStyle,
                    gridColumn: { xs: '3 / 4', md: 'auto' },
                  }}
                  label='What to do?'
                  defaultValue={todo.text}
                  onChange={(event) =>
                    debouncedUpdate(todoList.id, todo.id, { text: event.target.value })
                  }
                  inputProps={{
                    style: {
                      textDecoration: todo.completed ? 'line-through' : 'none',
                    },
                  }}
                />
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.625rem',
                    gridColumn: { xs: '3 / 4', md: 'auto' },
                    gridRow: { xs: '2 / 3', md: 'auto' },
                    justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    minWidth: 0,
                  }}
                >
                  <TextField
                    sx={{
                      ...secondaryFieldStyle,
                      minWidth: { xs: '100%', sm: '170px' },
                      width: { xs: '100%', sm: 'auto' },
                    }}
                    type='date'
                    label='Due date'
                    InputLabelProps={{ shrink: true }}
                    defaultValue={todo.dueDate || ''}
                    onChange={(event) =>
                      debouncedUpdate(todoList.id, todo.id, {
                        dueDate: event.target.value || null,
                      })
                    }
                  />
                  {remaining && (
                    <Chip
                      sx={{
                        backgroundColor: remaining.color === 'error' ? '#f7e6e4' : '#f1efe9',
                        borderRadius: '999px',
                        color: remaining.color === 'error' ? '#9f3a32' : '#5f5a52',
                        fontFamily: 'ballinger, sans-serif',
                        fontSize: '0.8rem',
                        height: '30px',
                      }}
                      label={remaining.text}
                      size='small'
                    />
                  )}
                  {saveStatus[todo.id] && (
                    <Typography
                      variant='caption'
                      sx={{
                        color: '#7b756d',
                        fontFamily: 'ballinger, sans-serif',
                        minWidth: '50px',
                        textAlign: { xs: 'left', md: 'right' },
                      }}
                      color={saveStatus[todo.id] === 'error' ? 'error' : 'text.secondary'}
                    >
                      {saveStatus[todo.id] === 'saving'
                        ? 'Saving...'
                        : saveStatus[todo.id] === 'saved'
                          ? 'Saved'
                          : 'Error'}
                    </Typography>
                  )}
                  <Button
                    sx={{
                      color: '#8a857d',
                      minWidth: 0,
                      padding: '6px',
                      marginLeft: { xs: 'auto', sm: 0 },
                      '&:hover': { backgroundColor: '#f3f1eb' },
                    }}
                    size='small'
                    onClick={() => {
                      if (debounceTimers.current[todo.id]) {
                        clearTimeout(debounceTimers.current[todo.id])
                        delete debounceTimers.current[todo.id]
                      }
                      deleteTodo({
                        variables: { todoListId: todoList.id, todoId: todo.id },
                      })
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Box>
            )
          })}
        <Box sx={{ paddingTop: '1rem' }}>
          <Button
            sx={{
              alignSelf: 'flex-start',
              color: '#111111',
              fontFamily: 'ballinger, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              paddingInline: 0,
              textTransform: 'none',
              '&:hover': { backgroundColor: 'transparent' },
            }}
            onClick={() =>
              addTodo({
                variables: { todoListId: todoList.id, text: '' },
              })
            }
          >
            Add Todo <AddIcon sx={{ marginLeft: '0.25rem' }} />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
