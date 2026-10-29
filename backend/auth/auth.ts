import { Router } from "express";

const router = Router();

router.get("/login", async function (req, res, next) {
  try {
    return res.json({ message: "testing API" });
  } catch (err) {
    return next(err);
  }
});

export default router;
