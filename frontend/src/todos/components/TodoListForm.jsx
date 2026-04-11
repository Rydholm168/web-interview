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
  backgroundColor: '#ffffff',
  border: '1px solid #e7e3dc',
  borderRadius: '6px',
  margin: '0 1rem',
  padding: '1.5rem',
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
      <Typography component='h2' sx={{ color: '#1b1b1b', fontSize: '2rem', marginBottom: '1rem' }}>
        {todoList.title}
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todoList.todos.map((todo, index) => {
            const remaining = getRemainingText(todo.dueDate)
            return (
              <Box
                key={todo.id}
                sx={{
                  alignItems: 'center',
                  borderBottom:
                    index === todoList.todos.length - 1 ? 'none' : '1px solid #f0ece5',
                  display: 'flex',
                  gap: '0.5rem',
                  paddingBlock: '1rem',
                }}
              >
                <Typography sx={{ color: '#1f1f1f', marginRight: '0.25rem', minWidth: '1.75rem' }} variant='h6'>
                  {index + 1}
                </Typography>
                <Checkbox
                  checked={todo.completed}
                  sx={{
                    color: '#8a857d',
                    padding: '6px',
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
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      '& fieldset': { borderColor: '#dcd5c8' },
                    },
                    '& .MuiInputLabel-root': { color: '#7b756d' },
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
                <TextField
                  sx={{
                    minWidth: '150px',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      '& fieldset': { borderColor: '#dcd5c8' },
                    },
                    '& .MuiInputLabel-root': { color: '#7b756d' },
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
                    }}
                    label={remaining.text}
                    size='small'
                  />
                )}
                <Button
                  sx={{ color: '#8a857d', minWidth: 0, padding: '8px' }}
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
                {saveStatus[todo.id] && (
                  <Typography
                    variant='caption'
                    sx={{ color: '#7b756d', minWidth: '50px' }}
                    color={saveStatus[todo.id] === 'error' ? 'error' : 'text.secondary'}
                  >
                    {saveStatus[todo.id] === 'saving'
                      ? 'Saving...'
                      : saveStatus[todo.id] === 'saved'
                        ? 'Saved'
                        : 'Error'}
                  </Typography>
                )}
              </Box>
            )
          })}
        <Box sx={{ paddingTop: '1rem' }}>
          <Button
            sx={{
              color: '#111111',
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
      </div>
    </Box>
  )
}
