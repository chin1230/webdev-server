import type { Express } from "express";

export default function QueryParameters(app: Express) {
  app.get("/lab5/calculator", (req, res) => {
    const { a, b, operation } = req.query;

    if (typeof a !== "string" || typeof b !== "string") {
      res.status(400).send("Please provide both a and b");
      return;
    }

    const first = parseInt(a, 10);
    const second = parseInt(b, 10);
    let result: number | string;

    switch (operation) {
      case "add":
        result = first + second;
        break;
      case "subtract":
        result = first - second;
        break;
      case "multiply":
        result = first * second;
        break;
      case "divide":
        result = first / second;
        break;
      default:
        result = "Invalid operation";
    }

    res.send(result.toString());
  });
}