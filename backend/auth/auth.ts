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

/** POST /auth/register:   { user } => { newUser: {name, email, alt_email, email_verified, alt_email_verified,...} }
 *
 *
 * Returns { name, email, alt_email, email_verified, alt_email_verified,...}
 *  JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const erros = validator.errors.map((e) => e.stack);
      throw new BadRequestError(erros);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    //create token
    newUser.token = token;
    return res.status(201).json({ newUser });
  } catch (e) {
    return next(e);
  }
});
