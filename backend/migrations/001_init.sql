CREATE TABLE todo_lists (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES todo_lists(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  due_date TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_todos_list_id ON todos(list_id);

INSERT INTO todo_lists (id, title) VALUES
  ('0000000001', 'First List'),
  ('0000000002', 'Second List');
