import crypto from 'node:crypto'
import { db } from './db.js'

const rowToTodo = (row) => ({
  id: row.id,
  text: row.text,
  completed: Boolean(row.completed),
  dueDate: row.due_date,
})

const statements = {
  selectLists: db.prepare('SELECT id, title FROM todo_lists ORDER BY created_at, id'),
  selectAllTodos: db.prepare(
    'SELECT id, list_id, text, completed, due_date FROM todos ORDER BY created_at, id'
  ),
  selectList: db.prepare('SELECT id, title FROM todo_lists WHERE id = ?'),
  selectTodosForList: db.prepare(
    'SELECT id, text, completed, due_date FROM todos WHERE list_id = ? ORDER BY created_at, id'
  ),
  listExists: db.prepare('SELECT 1 FROM todo_lists WHERE id = ?'),
  insertTodo: db.prepare('INSERT INTO todos (id, list_id, text) VALUES (?, ?, ?)'),
  selectTodo: db.prepare(
    'SELECT id, text, completed, due_date FROM todos WHERE id = ? AND list_id = ?'
  ),
  selectTodoById: db.prepare(
    'SELECT id, text, completed, due_date FROM todos WHERE id = ?'
  ),
  deleteTodo: db.prepare('DELETE FROM todos WHERE id = ? AND list_id = ?'),
}

export const getTodoLists = () => {
  const lists = statements.selectLists.all()
  const todos = statements.selectAllTodos.all()
  const byList = new Map(lists.map((l) => [l.id, { ...l, todos: [] }]))
  for (const t of todos) byList.get(t.list_id)?.todos.push(rowToTodo(t))
  return [...byList.values()]
}

export const getTodoList = (id) => {
  const list = statements.selectList.get(id)
  if (!list) return undefined
  const todos = statements.selectTodosForList.all(id).map(rowToTodo)
  return { ...list, todos }
}

const assertListExists = (todoListId) => {
  if (!statements.listExists.get(todoListId))
    throw new Error(`TodoList ${todoListId} not found`)
}

export const addTodo = (todoListId, text) => {
  assertListExists(todoListId)
  const id = crypto.randomUUID()
  statements.insertTodo.run(id, todoListId, text)
  return rowToTodo(statements.selectTodoById.get(id))
}

export const updateTodo = (todoListId, todoId, fields) => {
  const sets = []
  const values = []
  if ('text' in fields) {
    sets.push('text = ?')
    values.push(fields.text)
  }
  if ('completed' in fields) {
    sets.push('completed = ?')
    values.push(fields.completed ? 1 : 0)
  }
  if ('dueDate' in fields) {
    sets.push('due_date = ?')
    values.push(fields.dueDate)
  }
  if (sets.length > 0) {
    const result = db
      .prepare(`UPDATE todos SET ${sets.join(', ')} WHERE id = ? AND list_id = ?`)
      .run(...values, todoId, todoListId)
    if (result.changes === 0) throw new Error(`Todo ${todoId} not found`)
  }
  const row = statements.selectTodo.get(todoId, todoListId)
  if (!row) throw new Error(`Todo ${todoId} not found`)
  return rowToTodo(row)
}

export const deleteTodo = (todoListId, todoId) => {
  const result = statements.deleteTodo.run(todoId, todoListId)
  if (result.changes === 0) throw new Error(`Todo ${todoId} not found`)
  return true
}
