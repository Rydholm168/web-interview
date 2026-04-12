import React, { Fragment, useState } from 'react'
import {
  Box,
  ButtonBase,
  Typography,
  CircularProgress,
} from '@mui/material'
import { useQuery } from '@apollo/client/react'
import { GET_TODO_LISTS } from '../graphql'
import { TodoListForm } from './TodoListForm/TodoListForm'
import { assetUrl } from '../../assetUrl'

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
        <Typography component='h2' sx={headingStyle}>
          My Todo Lists
        </Typography>
        <Box sx={tabsStyle}>
          {todoLists.map((list) => {
            const isActive = list.id === selectedListId
            return (
              <ButtonBase
                key={list.id}
                disableRipple
                onClick={() => setActiveList(list.id)}
                sx={getTabStyle(isActive, list.isComplete)}
              >
                <Box component='span' sx={getTabLabelStyle(list.isComplete)}>
                  {list.isComplete && (
                    <Box
                      component='img'
                      alt=''
                      src={assetUrl('checkmark_circle.svg')}
                      sx={tabCheckmarkStyle}
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

const sectionStyle = {
  overflow: 'hidden',
  padding: '1rem 0 0',
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

const tabsStyle = {
  borderBottom: '1px solid #dfdbd2',
  display: 'flex',
  marginInline: 0,
  marginTop: '1rem',
  overflowX: 'auto',
}

const getTabStyle = (isActive, isComplete) => ({
  alignItems: 'center',
  backgroundColor: isComplete ? 'rgb(220, 244, 229)' : 'transparent',
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
    backgroundColor: isComplete ? 'rgb(200, 234, 212)' : '#f2f2f2',
  },
})

const getTabLabelStyle = (isComplete) => ({
  color: isComplete ? '#7b756d' : '#262626',
  position: 'relative',
  textDecoration: isComplete ? 'line-through' : 'none',
})

const tabCheckmarkStyle = {
  height: '18px',
  marginRight: '6px',
  position: 'absolute',
  right: '100%',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '18px',
}
