import bcrypt from "bcrypt";

import {
  createUser,
  findUserByEmail,
  findUserByUsername
} from "../models/userModel.js";

const SALT_ROUNDS = 12;

export function showRegisterPage(req, res) {
  if (req.session.user) {
    return res.redirect("/amiibos");
  }

  return res.render("auth/register", {
    title: "Register",
    formData: {
      username: "",
      email: ""
    },
    validationErrors: []
  });
}

export async function registerUser(req, res, next) {
  try {
    const username = req.body.username?.trim() || "";
    const email = req.body.email?.trim().toLowerCase() || "";
    const password = req.body.password || "";
    const confirmPassword = req.body.confirmPassword || "";

    const validationErrors = validateRegistration({
      username,
      email,
      password,
      confirmPassword
    });

    if (validationErrors.length > 0) {
      return res.status(400).render("auth/register", {
        title: "Register",
        formData: {
          username,
          email
        },
        validationErrors
      });
    }

    const existingEmail = await findUserByEmail(email);

    if (existingEmail) {
      validationErrors.push(
        "An account already uses that email address."
      );
    }

    const existingUsername = await findUserByUsername(username);

    if (existingUsername) {
      validationErrors.push(
        "That username is already taken."
      );
    }

    if (validationErrors.length > 0) {
      return res.status(409).render("auth/register", {
        title: "Register",
        formData: {
          username,
          email
        },
        validationErrors
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      SALT_ROUNDS
    );

    await createUser({
      username,
      email,
      passwordHash
    });

    req.session.successMessage =
      "Your account was created. You can now log in.";

    return res.redirect("/login");
  } catch (error) {
    return next(error);
  }
}

export function showLoginPage(req, res) {
  if (req.session.user) {
    return res.redirect("/amiibos");
  }

  return res.render("auth/login", {
    title: "Log In",
    email: "",
    validationErrors: []
  });
}

export async function loginUser(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase() || "";
    const password = req.body.password || "";

    if (!email || !password) {
      return res.status(400).render("auth/login", {
        title: "Log In",
        email,
        validationErrors: [
          "Enter both your email address and password."
        ]
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).render("auth/login", {
        title: "Log In",
        email,
        validationErrors: [
          "The email address or password is incorrect."
        ]
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).render("auth/login", {
        title: "Log In",
        email,
        validationErrors: [
          "The email address or password is incorrect."
        ]
      });
    }

    req.session.regenerate((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      req.session.user = {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      req.session.successMessage =
        `Welcome back, ${user.username}!`;

      return req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        return res.redirect("/amiibos");
      });
    });
  } catch (error) {
    return next(error);
  }
}

export function logoutUser(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");

    return res.redirect("/");
  });
}

function validateRegistration({
  username,
  email,
  password,
  confirmPassword
}) {
  const errors = [];

  if (username.length < 3 || username.length > 50) {
    errors.push(
      "Username must contain between 3 and 50 characters."
    );
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push(
      "Username may only contain letters, numbers, underscores, and hyphens."
    );
  }

  if (!isValidEmail(email)) {
    errors.push("Enter a valid email address.");
  }

  if (password.length < 8) {
    errors.push(
      "Password must contain at least 8 characters."
    );
  }

  if (!/[A-Z]/.test(password)) {
    errors.push(
      "Password must contain at least one uppercase letter."
    );
  }

  if (!/[a-z]/.test(password)) {
    errors.push(
      "Password must contain at least one lowercase letter."
    );
  }

  if (!/[0-9]/.test(password)) {
    errors.push(
      "Password must contain at least one number."
    );
  }

  if (password !== confirmPassword) {
    errors.push("The passwords do not match.");
  }

  return errors;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}