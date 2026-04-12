import React, { useRef } from 'react'
import { TextField, Box, Button, Typography, Checkbox } from '@mui/material'
import { SaveStatusLabel } from './SaveStatusLabel'
import { SaveStatus } from '../useDebouncedSave'
import {
  RemainingColor,
  REMAINING_ICON,
  STATUS_BAR_BACKGROUND,
  getRemainingText,
} from './remaining'

export const TodoRow = ({
  todo,
  index,
  isLast,
  todoListId,
  saveStatus,
  newTodoIdRef,
  updateTodo,
  deleteTodo,
  addTodo,
  debouncedUpdate,
  cancelDebounce,
}) => {
  const inputRef = useRef(null)
  const remaining = todo.completed
    ? { text: 'Complete', color: RemainingColor.Success }
    : getRemainingText(todo.dueDate)

  const toggleCompleted = () =>
    updateTodo({
      variables: { todoListId, todoId: todo.id, completed: !todo.completed },
    })

  return (
    <Box sx={getRowStyle(isLast)}>
      <Typography sx={indexStyle}>{index + 1}</Typography>
      <Checkbox
        checked={todo.completed}
        sx={checkboxStyle}
        onChange={toggleCompleted}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            toggleCompleted()
          }
        }}
      />
      <Box sx={inputColumnStyle}>
        <Box sx={statusRowStyle}>
          {remaining ? (
            <Box
              className='todo-status-bar'
              onClick={() => inputRef.current?.focus()}
              sx={getStatusBarStyle(remaining.color)}
            >
              <Box sx={statusLabelStyle}>
                <Box
                  component='img'
                  alt=''
                  aria-hidden='true'
                  src={REMAINING_ICON[remaining.color]}
                  sx={statusIconStyle}
                />
                {remaining.text}
              </Box>
              {saveStatus && (
                <Typography variant='caption' sx={getSaveLabelStyle(saveStatus)}>
                  <SaveStatusLabel status={saveStatus} />
                </Typography>
              )}
            </Box>
          ) : saveStatus ? (
            <Box className='todo-save-pill' sx={getSavePillStyle(saveStatus)}>
              <SaveStatusLabel status={saveStatus} />
            </Box>
          ) : null}
        </Box>
        <TextField
          sx={getTextFieldStyle(Boolean(remaining), Boolean(saveStatus))}
          placeholder='What to do?'
          defaultValue={todo.text}
          inputRef={(el) => {
            inputRef.current = el
            if (el && newTodoIdRef.current === todo.id) {
              el.focus()
              newTodoIdRef.current = null
            }
          }}
          onChange={(event) => debouncedUpdate(todo.id, { text: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addTodo()
            }
          }}
          inputProps={{
            style: { textDecoration: todo.completed ? 'line-through' : 'none' },
          }}
        />
      </Box>
      <Box sx={trailingColumnStyle}>
        <TextField
          sx={dueDateFieldStyle}
          type='date'
          label='Due date'
          InputLabelProps={{ shrink: true }}
          defaultValue={todo.dueDate || ''}
          onChange={(event) => debouncedUpdate(todo.id, { dueDate: event.target.value || null })}
        />
        <Button
          sx={deleteButtonStyle}
          size='small'
          onClick={() => {
            cancelDebounce(todo.id)
            deleteTodo({ variables: { todoListId, todoId: todo.id } })
          }}
        >
          <Box
            component='img'
            alt='Delete'
            src={`${import.meta.env.BASE_URL}close.svg`}
            sx={deleteIconStyle}
          />
        </Button>
      </Box>
    </Box>
  )
}

const getRowStyle = (isLast) => ({
  borderBottom: isLast ? 'none' : '1px solid #f0ece5',
  display: 'grid',
  gap: '0.875rem',
  gridTemplateColumns: {
    xs: 'auto auto minmax(0, 1fr)',
    md: 'auto auto minmax(0, 1fr) auto',
  },
  gridTemplateRows: { xs: 'auto auto', md: 'auto' },
  paddingBlock: '0.875rem',
  width: '100%',
})

const indexStyle = {
  alignSelf: 'center',
  color: '#5f5a52',
  fontFamily: 'ballinger, sans-serif',
  fontSize: '0.95rem',
  fontWeight: 500,
  marginTop: '26px',
  minWidth: '1.5rem',
}

const checkboxStyle = {
  alignSelf: 'center',
  color: '#8a857d',
  marginTop: '26px',
  padding: '4px',
  '&.Mui-checked': { color: '#262626' },
}

const inputColumnStyle = {
  gridColumn: { xs: '3 / 4', md: 'auto' },
  minWidth: 0,
  width: '100%',
  '&:focus-within .todo-status-bar': {
    boxShadow: 'inset 1px 0 0 #262626, inset -1px 0 0 #262626, inset 0 1px 0 #262626',
  },
  '&:focus-within .todo-save-pill': {
    borderColor: '#262626',
  },
}

const statusRowStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  minHeight: '26px',
}

const getStatusBarStyle = (color) => ({
  alignItems: 'center',
  backgroundColor: STATUS_BAR_BACKGROUND[color],
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
  color: '#3a3a3a',
  cursor: 'text',
  display: 'flex',
  fontFamily: 'ballinger, sans-serif',
  fontSize: '0.9rem',
  fontWeight: 400,
  height: '26px',
  justifyContent: 'space-between',
  paddingInline: '14px',
  whiteSpace: 'nowrap',
  width: '100%',
})

const statusLabelStyle = {
  alignItems: 'center',
  display: 'flex',
}

const statusIconStyle = {
  height: '16px',
  marginRight: '8px',
  width: '16px',
}

const getSaveLabelStyle = (status) => ({
  alignItems: 'center',
  color: status === SaveStatus.Error ? '#c62828' : '#5f5a52',
  display: 'flex',
  fontFamily: 'ballinger, sans-serif',
  fontSize: '0.8rem',
})

const getSavePillStyle = (status) => ({
  alignItems: 'center',
  backgroundColor: 'rgb(240, 238, 233)',
  borderColor: '#d8d0c3',
  borderRadius: '4px 4px 0 0',
  borderStyle: 'solid',
  borderWidth: '1px 1px 0 1px',
  color: status === SaveStatus.Error ? '#c62828' : '#5f5a52',
  display: 'flex',
  fontFamily: 'ballinger, sans-serif',
  fontSize: '0.8rem',
  height: '26px',
  justifyContent: 'center',
  minWidth: '80px',
  paddingInline: '12px',
})

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
    backgroundColor: 'rgb(250, 250, 250)',
    borderRadius: '4px',
    '& fieldset': { borderColor: '#d8d0c3' },
    '&:hover fieldset': { borderColor: '#bfb6a8' },
    '&.Mui-focused fieldset': { borderColor: '#262626', borderWidth: '1px' },
  },
}

const getTextFieldStyle = (hasRemaining, hasStatus) => ({
  ...textFieldStyle,
  width: '100%',
  '& .MuiOutlinedInput-root': {
    ...textFieldStyle['& .MuiOutlinedInput-root'],
    borderTopLeftRadius: hasRemaining ? 0 : '6px',
    borderTopRightRadius: hasRemaining || hasStatus ? 0 : '6px',
  },
})

const trailingColumnStyle = {
  alignItems: 'stretch',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.625rem',
  gridColumn: { xs: '3 / 4', md: 'auto' },
  gridRow: { xs: '2 / 3', md: 'auto' },
  justifyContent: { xs: 'flex-start', md: 'flex-end' },
  minWidth: 0,
}

const dueDateFieldStyle = {
  ...textFieldStyle,
  marginTop: '26px',
  minWidth: { xs: '100%', sm: '170px' },
  width: { xs: '100%', sm: 'auto' },
}

const deleteButtonStyle = {
  alignSelf: 'center',
  color: '#8a857d',
  marginTop: '26px',
  minWidth: 0,
  padding: '6px',
  marginLeft: { xs: 'auto', sm: 0 },
  '&:hover': { backgroundColor: '#f3f1eb' },
}

const deleteIconStyle = {
  height: '16px',
  width: '16px',
}
