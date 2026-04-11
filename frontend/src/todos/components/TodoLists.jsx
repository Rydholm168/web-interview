import React, { Fragment, useState } from 'react'
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useQuery } from '@apollo/client/react'
import { GET_TODO_LISTS } from '../graphql'
import { TodoListForm } from './TodoListForm'

const sectionStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e7e3dc',
  borderRadius: '6px',
  padding: '1.5rem',
}

export const TodoLists = ({ style }) => {
  const [activeList, setActiveList] = useState()
  const { data, loading, error } = useQuery(GET_TODO_LISTS)

  if (loading) return <CircularProgress />
  if (error) return <Typography color='error'>Error: {error.message}</Typography>

  const todoLists = data.todoLists

  if (!todoLists.length) return null

  const activeListData = todoLists.find((list) => list.id === activeList)

  return (
    <Fragment>
      <Box style={style} sx={sectionStyle}>
        <Typography
          component='h2'
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            color: 'rgb(38, 38, 38)',
            display: '-webkit-box',
            fontFamily: 'ballinger, sans-serif',
            fontSize: '20px',
            fontWeight: 500,
            lineHeight: '24px',
            margin: 0,
            overflow: 'hidden',
            marginBottom: '1rem',
          }}
        >
          My Todo Lists
        </Typography>
        <List sx={{ padding: 0 }}>
          {todoLists.map((list, index) => (
            <ListItemButton
              key={list.id}
              onClick={() => setActiveList(list.id)}
              sx={{
                borderBottom:
                  index === todoLists.length - 1 ? 'none' : '1px solid #f0ece5',
                minHeight: '64px',
                paddingInline: 0,
                paddingBlock: '0.75rem',
              }}
            >
              <ListItemIcon sx={{ color: '#8a857d', minWidth: '3rem' }}>
                {list.isComplete ? <CheckCircleIcon color='success' /> : <ReceiptIcon />}
              </ListItemIcon>
              <ListItemText
                primary={list.title}
                primaryTypographyProps={{
                  sx: {
                    color: list.isComplete ? '#7b756d' : '#1f1f1f',
                    fontSize: '1.15rem',
                    textDecoration: list.isComplete ? 'line-through' : 'none',
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
      {activeListData && <TodoListForm key={activeList} todoList={activeListData} />}
    </Fragment>
  )
}
