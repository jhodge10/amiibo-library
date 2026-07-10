import bcrypt from "bcrypt";
import {
  createUser,
  getUserByEmail
} from "../models/userModel.js";

export async function registerForm(req, res) {
  res.render("auth/register", {
    title: "Register"
  });
}

export async function registerUser(req, res) {

  try {

    const {
      username,
      email,
      password
    } = req.body;

    const existing = await getUserByEmail(email);

    if (existing) {

      return res.send("Email already exists.");

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await createUser(
      username,
      email,
      hashedPassword
    );

    res.redirect("/login");

  } catch (err) {

    console.error(err);

    res.status(500).send("Registration failed.");

  }

}