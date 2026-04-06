import * as data from './data.js'

export const resolvers = {
  Query: {
    todoLists: () => data.getTodoLists(),
  },
  TodoList: {
    isComplete: (parent) => parent.todos.length > 0 && parent.todos.every((t) => t.completed),
  },
  Mutation: {
    addTodo: (_, { todoListId, text }) => data.addTodo(todoListId, text),
    updateTodo: (_, { todoListId, todoId, ...fields }) =>
      data.updateTodo(todoListId, todoId, fields),
    deleteTodo: (_, { todoListId, todoId }) => data.deleteTodo(todoListId, todoId),
  },
}
