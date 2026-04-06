import React, { Fragment, useState } from 'react'
import {
  Card,
  CardContent,
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
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {todoLists.map((list) => (
              <ListItemButton key={list.id} onClick={() => setActiveList(list.id)}>
                <ListItemIcon>
                  {list.isComplete ? <CheckCircleIcon color='success' /> : <ReceiptIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={list.title}
                  sx={
                    list.isComplete
                      ? { textDecoration: 'line-through', color: 'text.secondary' }
                      : {}
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
      {activeListData && <TodoListForm key={activeList} todoList={activeListData} />}
    </Fragment>
  )
}
