export const typeDefs = `#graphql
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
    dueDate: String
  }

  type TodoList {
    id: ID!
    title: String!
    todos: [Todo!]!
    isComplete: Boolean!
  }

  type Query {
    todoLists: [TodoList!]!
  }

  type Mutation {
    addTodo(todoListId: ID!, text: String!): Todo!
    updateTodo(todoListId: ID!, todoId: ID!, text: String, completed: Boolean, dueDate: String): Todo!
    deleteTodo(todoListId: ID!, todoId: ID!): Boolean!
  }
`
