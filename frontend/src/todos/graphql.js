import { gql } from '@apollo/client'

const TODO_FIELDS = gql`
  fragment TodoFields on Todo {
    id
    text
    completed
    dueDate
  }
`

export const GET_TODO_LISTS = gql`
  ${TODO_FIELDS}
  query GetTodoLists {
    todoLists {
      id
      title
      isComplete
      todos {
        ...TodoFields
      }
    }
  }
`

export const ADD_TODO = gql`
  ${TODO_FIELDS}
  mutation AddTodo($todoListId: ID!, $text: String!) {
    addTodo(todoListId: $todoListId, text: $text) {
      ...TodoFields
    }
  }
`

export const UPDATE_TODO = gql`
  ${TODO_FIELDS}
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
      ...TodoFields
    }
  }
`

export const DELETE_TODO = gql`
  mutation DeleteTodo($todoListId: ID!, $todoId: ID!) {
    deleteTodo(todoListId: $todoListId, todoId: $todoId)
  }
`
