import React, { Fragment, useState } from 'react'
import {
  Box,
  ButtonBase,
  Typography,
  CircularProgress,
} from '@mui/material'
import { useQuery } from '@apollo/client/react'
import { GET_TODO_LISTS } from '../graphql'
import { TodoListForm } from './TodoListForm'

const sectionStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e7e3dc',
  borderRadius: '6px',
  overflow: 'hidden',
  padding: '1.5rem 1.5rem 0',
}

export const TodoLists = ({ style }) => {
  const [activeList, setActiveList] = useState()
  const { data, loading, error } = useQuery(GET_TODO_LISTS)

  if (loading) return <CircularProgress />
  if (error) return <Typography color='error'>Error: {error.message}</Typography>

  const todoLists = data.todoLists

  if (!todoLists.length) return null

  const selectedListId = activeList ?? todoLists[0]?.id
  const activeListData = todoLists.find((list) => list.id === selectedListId)

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
        <Box
          sx={{
            borderBottom: '1px solid #dfdbd2',
            display: 'flex',
            marginInline: '-1.5rem',
            marginTop: '1rem',
          }}
        >
          {todoLists.map((list) => {
            const isActive = list.id === selectedListId

            return (
              <ButtonBase
              key={list.id}
              onClick={() => setActiveList(list.id)}
              sx={{
                alignItems: 'center',
                backgroundColor: isActive ? '#f2f2f2' : 'transparent',
                borderBottom: isActive ? '3px solid #111111' : '3px solid transparent',
                color: '#262626',
                display: 'flex',
                flex: 1,
                fontFamily: 'ballinger, sans-serif',
                fontSize: '16px',
                fontWeight: isActive ? 500 : 400,
                height: '74px',
                justifyContent: 'center',
                lineHeight: '24px',
                '&:hover': {
                  backgroundColor: '#f2f2f2',
                },
              }}
            >
                <Box
                  component='span'
                  sx={{
                    color: list.isComplete ? '#7b756d' : '#262626',
                    textDecoration: list.isComplete ? 'line-through' : 'none',
                  }}
                >
                  {list.title}
                </Box>
              </ButtonBase>
            )
          })}
        </Box>
      </Box>
      {activeListData && <TodoListForm key={selectedListId} todoList={activeListData} />}
    </Fragment>
  )
}
