import type { Express, Request, Response } from "express";

const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

const courseModule = {
  id: "5.2.3",
  name: "Node.js",
  description: "Learn Node.js",
  course: "CS4550",
};

export default function WorkingWithRemoteObjects(app: Express) {
  const getAssignment = (req: Request, res: Response) => {
    res.json(assignment);
  };

  app.get("/lab5/assignment", getAssignment);
  const getAssignmentTitle = (req: Request, res: Response) => {
    res.json(assignment.title);
  };
  const setAssignmentTitle = (
    req: Request<{ newTitle: string }>,
    res: Response,
  ) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  };

  app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);

  app.get("/lab5/assignment/title", getAssignmentTitle);

  app.get("/lab5/module", (req, res) => {
    res.json(courseModule);
  });

  app.get("/lab5/module/name", (req, res) => {
    res.json(courseModule.name);
  });

  app.get("/lab5/module/name/:newName", (req, res) => {
    courseModule.name = req.params.newName;
    res.json(courseModule);
  });

  app.get("/lab5/module/description/:newDescription", (req, res) => {
    courseModule.description = req.params.newDescription;
    res.json(courseModule);
  });

  app.get("/lab5/assignment/score/:newScore", (req, res) => {
    const score = Number(req.params.newScore);

    if (!Number.isFinite(score)) {
      res.status(400).send("Score must be a number");
      return;
    }

    assignment.score = score;
    res.json(assignment);
  });

  app.get("/lab5/assignment/completed/:completed", (req, res) => {
    const { completed } = req.params;

    if (completed !== "true" && completed !== "false") {
      res.status(400).send("Completed must be true or false");
      return;
    }

    assignment.completed = completed === "true";
    res.json(assignment);
  });
}