import { Router } from "express";
import jsonschema from "jsonschema";
import userRegisterSchema from "../schemas/user/userRegister.json";
import userLoginSchema from "../schemas/user/userLogin.json";
import { BadRequestError } from "../expressError";
import User from "../models/user";
import token from "../helpers/tokens";
const router = Router();

router.post("/login", async function (req, res, next) {
  try {
    const validJson = jsonschema.validate(req.body, userLoginSchema);
    if (!validJson.valid) {
      const errs = validJson.errors.map((e) => e.stack);
      throw new BadRequestError(errs.join(", "));
    }

    const { email, password } = req.body;
    const user = await User.authenticate(email, password);
    const userToken = token.createToken(user);
    user.token = userToken;

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      alt_email: user.alt_email,
      tel_number: user.tel_number,
      bio: user.bio,
      year_of_study: user.year_of_study,
      token: userToken,
    };

    return res.json({ user: userWithoutPassword });
  } catch (err) {
    return next(err);
  }
});

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
      throw new BadRequestError(erros.join(", "));
    }

    const newUser = await User.create({ ...req.body });

    // JWT token for later authorization though middleware
    const userToken = token.createToken(newUser);

    // remove password from the response
    // add token to the response
    const userWithoutPassword = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      alt_email: newUser.alt_email,
      tel_number: newUser.tel_number,
      bio: newUser.bio,
      year_of_study: newUser.year_of_study,
      token: userToken,
    };

    return res.status(201).json({ user: userWithoutPassword });
  } catch (e) {
    return next(e);
  }
});

export default router;
