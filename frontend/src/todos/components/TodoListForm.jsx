import React, { useRef, useCallback, useEffect } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
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
      debounceTimers.current[todoId] = setTimeout(() => {
        updateTodo({ variables: { todoListId, todoId, ...fields } })
        delete debounceTimers.current[todoId]
      }, 300)
    },
    [updateTodo],
  )

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todoList.todos.map((todo, index) => {
            const remaining = getRemainingText(todo.dueDate)
            return (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {index + 1}
                </Typography>
                <Checkbox
                  checked={todo.completed}
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
                  sx={{ flexGrow: 1, marginTop: '1rem' }}
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
                  sx={{ marginLeft: '8px', marginTop: '1rem', minWidth: '150px' }}
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
                    sx={{ marginLeft: '8px' }}
                    label={remaining.text}
                    color={remaining.color}
                    size='small'
                  />
                )}
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
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
              </div>
            )
          })}
          <CardActions>
            <Button
              color='primary'
              onClick={() =>
                addTodo({
                  variables: { todoListId: todoList.id, text: '' },
                })
              }
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </div>
      </CardContent>
    </Card>
  )
}
