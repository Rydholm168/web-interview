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
  overflow: 'hidden',
  padding: '1rem 0 0',
}

export const TodoLists = () => {
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
      <Box sx={sectionStyle}>
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
            marginInline: 0,
            marginTop: '1rem',
            overflowX: 'auto',
          }}
        >
          {todoLists.map((list) => {
            const isActive = list.id === selectedListId

            return (
              <ButtonBase
              key={list.id}
              disableRipple
              onClick={() => setActiveList(list.id)}
              sx={{
                alignItems: 'center',
                backgroundColor: list.isComplete ? 'rgb(220, 244, 229)' : 'transparent',
                borderBottom: isActive ? '3px solid #111111' : '3px solid transparent',
                color: '#262626',
                display: 'flex',
                flex: { xs: '0 0 50%', sm: 1 },
                fontFamily: 'ballinger, sans-serif',
                fontSize: '16px',
                fontWeight: isActive ? 500 : 400,
                height: { xs: '64px', sm: '74px' },
                justifyContent: 'center',
                lineHeight: '24px',
                minWidth: { xs: '160px', sm: 0 },
                paddingInline: '1rem',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: list.isComplete ? 'rgb(200, 234, 212)' : '#f2f2f2',
                },
              }}
            >
                <Box
                  component='span'
                  sx={{
                    color: list.isComplete ? '#7b756d' : '#262626',
                    position: 'relative',
                    textDecoration: list.isComplete ? 'line-through' : 'none',
                  }}
                >
                  {list.isComplete && (
                    <Box
                      component='img'
                      alt=''
                      src='/checkmark_circle.svg'
                      sx={{
                        height: '18px',
                        position: 'absolute',
                        right: '100%',
                        marginRight: '6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                      }}
                    />
                  )}
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
