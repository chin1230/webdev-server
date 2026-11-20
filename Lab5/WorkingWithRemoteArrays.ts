import type { Express, Request, Response } from "express";

const todos = [
  { id: 1, title: "Task 1", completed: false, description: "" },
  { id: 2, title: "Task 2", completed: true, description: "" },
  { id: 3, title: "Task 3", completed: false, description: "" },
  { id: 4, title: "Task 4", completed: true, description: "" },
];

export default function WorkingWithRemoteArrays(app: Express) {
  const findTodoById = (id: string) => {
    return todos.find((todo) => todo.id === Number(id));
  };

  const getTodos = (req: Request, res: Response) => {
    const { completed } = req.query;

    if (completed !== undefined) {
      const completedBool = completed === "true";
      const filteredTodos = todos.filter((t) => t.completed === completedBool);
      res.json(filteredTodos);
      return;
    }

    res.json(todos);
  };

  const getTodoById = (req: Request<{ id: string }>, res: Response) => {
    const todo = findTodoById(req.params.id);

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.json(todo);
  };

  const createNewTodo = (req: Request, res: Response) => {
    const newTodo = {
      id: Date.now(),
      title: "New Task",
      completed: false,
      description: "",
    };

    todos.push(newTodo);
    res.json(todos);
  };

  const postNewTodo = (req: Request, res: Response) => {
    const newTodo = {
      description: "",
      ...req.body,
      id: Date.now(),
    };

    todos.push(newTodo);
    res.json(newTodo);
  };

  const removeTodo = (req: Request<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    todos.splice(todoIndex, 1);
    res.json(todos);
  };

  const deleteTodo = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === Number(id));

    if (todoIndex === -1) {
      res.status(404).json({
        message: `Unable to delete Todo with ID ${id}`,
      });
      return;
    }

    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  };

  const updateTodoTitle = (
    req: Request<{ id: string; title: string }>,
    res: Response
  ) => {
    const todo = findTodoById(req.params.id);

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    todo.title = req.params.title;
    res.json(todos);
  };

  const updateTodoCompleted = (
    req: Request<{ id: string; completed: string }>,
    res: Response
  ) => {
    const { id, completed } = req.params;
    const todo = findTodoById(id);

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    if (completed !== "true" && completed !== "false") {
      res.status(400).json({ message: "Completed must be true or false" });
      return;
    }

    todo.completed = completed === "true";
    res.json(todos);
  };

  const updateTodoDescription = (
    req: Request<{ id: string; description: string }>,
    res: Response
  ) => {
    const { id, description } = req.params;
    const todo = findTodoById(id);

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    todo.description = description;
    res.json(todos);
  };

  const updateTodo = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const todo = findTodoById(id);

    if (!todo) {
      res.status(404).json({
        message: `Unable to update Todo with ID ${id}`,
      });
      return;
    }

    const {
      title = todo.title,
      completed = todo.completed,
      description = todo.description,
    } = req.body ?? {};

    if (
      typeof title !== "string" ||
      typeof completed !== "boolean" ||
      typeof description !== "string"
    ) {
      res.status(400).json({ message: "Invalid todo fields" });
      return;
    }

    Object.assign(todo, { title, completed, description });
    res.sendStatus(200);
  };

  app.get("/lab5/todos", getTodos);
  app.get("/lab5/todos/create", createNewTodo);
  app.post("/lab5/todos", postNewTodo);
  app.get("/lab5/todos/:id", getTodoById);
  app.get("/lab5/todos/:id/delete", removeTodo);
  app.delete("/lab5/todos/:id", deleteTodo);
  app.put("/lab5/todos/:id", updateTodo);
  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
  app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
  app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
}