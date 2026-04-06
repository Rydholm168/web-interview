import { gql } from '@apollo/client'

export const GET_TODO_LISTS = gql`
  query GetTodoLists {
    todoLists {
      id
      title
      isComplete
      todos {
        id
        text
        completed
        dueDate
      }
    }
  }
`

export const ADD_TODO = gql`
  mutation AddTodo($todoListId: ID!, $text: String!) {
    addTodo(todoListId: $todoListId, text: $text) {
      id
      text
      completed
      dueDate
    }
  }
`

export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $todoListId: ID!
    $todoId: ID!
    $text: String
    $completed: Boolean
    $dueDate: String
  ) {
    updateTodo(
      todoListId: $todoListId
      todoId: $todoId
      text: $text
      completed: $completed
      dueDate: $dueDate
    ) {
      id
      text
      completed
      dueDate
    }
  }
`

export const DELETE_TODO = gql`
  mutation DeleteTodo($todoListId: ID!, $todoId: ID!) {
    deleteTodo(todoListId: $todoListId, todoId: $todoId)
  }
`
