import crypto from 'node:crypto'

const todoLists = {
  '0000000001': {
    id: '0000000001',
    title: 'First List',
    todos: [
      {
        id: crypto.randomUUID(),
        text: 'First todo of first list!',
        completed: false,
        dueDate: null,
      },
    ],
  },
  '0000000002': {
    id: '0000000002',
    title: 'Second List',
    todos: [
      {
        id: crypto.randomUUID(),
        text: 'First todo of second list!',
        completed: false,
        dueDate: null,
      },
    ],
  },
}

const getListOrThrow = (todoListId) => {
  const list = todoLists[todoListId]
  if (!list) throw new Error(`TodoList ${todoListId} not found`)
  return list
}

export const getTodoLists = () => Object.values(todoLists).map(structuredClone)

export const getTodoList = (id) => {
  const list = todoLists[id]
  return list ? structuredClone(list) : undefined
}

export const addTodo = (todoListId, text) => {
  const list = getListOrThrow(todoListId)
  const todo = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    dueDate: null,
  }
  list.todos.push(todo)
  return structuredClone(todo)
}

export const updateTodo = (todoListId, todoId, fields) => {
  const list = getListOrThrow(todoListId)
  const todo = list.todos.find((t) => t.id === todoId)
  if (!todo) throw new Error(`Todo ${todoId} not found`)
  Object.assign(todo, fields)
  return structuredClone(todo)
}

export const deleteTodo = (todoListId, todoId) => {
  const list = getListOrThrow(todoListId)
  const index = list.todos.findIndex((t) => t.id === todoId)
  if (index === -1) throw new Error(`Todo ${todoId} not found`)
  list.todos.splice(index, 1)
  return true
}
