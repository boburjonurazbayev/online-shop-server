import {
  loginScheme,
  registerScheme,
  postCategories,
  postSubCategories,
  postProducts,
  putProducts,
  putSubCategories,
  putCategories,
  deleteProducts,
  deleteSubCategories,
  deleteCategories,
} from "../utils/validation.js";
import { ValidationError } from "../utils/error.js";
import jwt from "../utils/jwt.js";

export default (req, res, next) => {
  try {
    if (req.url == "/login") {
      let { error } = loginScheme.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/register") {
      let { error } = registerScheme.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/categories" && req.method == "POST") {
      let { userId } = jwt.verify(req.headers.token);
      req.body.userId = userId;

      let { error } = postCategories.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/subcategories" && req.method == "POST") {
      let { userId } = jwt.verify(req.headers.token);
      req.body.userId = userId;

      let { error } = postSubCategories.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/products" && req.method == "POST") {
      let { userId } = jwt.verify(req.headers.token);
      req.body.userId = userId;

      let { error } = postProducts.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/categories" && req.method == "PUT") {
      let { userId } = jwt.verify(req.headers.token);
      req.body.userId = userId;

      let { error } = putCategories.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/subcategories" && req.method == "PUT") {
      let { userId } = jwt.verify(req.headers.token);
      req.body.userId = userId;

      let { error } = putSubCategories.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/products" && req.method == "PUT") {
      let { userId } = jwt.verify(req.headers.token);
      req.body.userId = userId;

      let { error } = putProducts.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/categories" && req.method == "DELETE") {
      let { userId } = jwt.verify(req.headers.token);
      req.body.userId = userId;

      let { error } = deleteCategories.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/subcategories" && req.method == "DELETE") {
      let { userId } = jwt.verify(req.headers.token);
      req.body.userId = userId;

      let { error } = deleteSubCategories.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/products" && req.method == "DELETE") {
      let { userId } = jwt.verify(req.headers.token);
      req.body.userId = userId;

      let { error } = deleteProducts.validate(req.body);
      if (error) throw error;
    }

    return next();
  } catch (error) {
    return next(new ValidationError(401, error.message));
  }
};
