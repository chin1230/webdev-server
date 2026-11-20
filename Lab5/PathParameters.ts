import type { Express } from "express";

export default function PathParameters(app: Express) {
  app.get("/lab5/add/:a/:b", (req, res) => {
    const { a, b } = req.params;
    const sum = parseInt(a, 10) + parseInt(b, 10);
    res.send(sum.toString());
  });

  app.get("/lab5/subtract/:a/:b", (req, res) => {
    const { a, b } = req.params;
    const difference = parseInt(a, 10) - parseInt(b, 10);
    res.send(difference.toString());
  });

  app.get("/lab5/multiply/:a/:b", (req, res) => {
    const { a, b } = req.params;
    const product = parseInt(a, 10) * parseInt(b, 10);
    res.send(product.toString());
  });

  app.get("/lab5/divide/:a/:b", (req, res) => {
    const { a, b } = req.params;
    const quotient = parseInt(a, 10) / parseInt(b, 10);
    res.send(quotient.toString());
  });
}