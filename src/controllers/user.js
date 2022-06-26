import { read, write } from "../utils/model.js";
import {
  AuthorizationError,
  InternalServerError,
  ValidationError,
} from "../utils/error.js";
import sha256 from "sha256";
import jwt from "../utils/jwt.js";
import path from "path";

const LOGIN = (req, res, next) => {
  try {
    let { userName, password } = req.body;
    let users = read("user");
    let user = users.find(
      (user) => user.userName == userName && user.password == sha256(password)
    );

    if (!user) {
      return next(new AuthorizationError(401, "wrong username or password"));
    }

    delete user.password;

    res.status(200).json({
      status: 200,
      message: "succes",
      token: jwt.sign({ userId: user.userId }),
      data: user,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const REGISTER = (req, res, next) => {
  try {
    let users = read("user");
    let userData = req.body;

    let userId = users.length ? users.at(-1).user_id + 1 : 1;

    let user = users.find((user) => user.userName == userData.userName);

    if (user) {
      return next(
        new AuthorizationError(401, "This username is already taken")
      );
    }
    userData.password = sha256(userData.password);
    userData.user_id = userId;
    users.push(userData);
    write("user", users);

    res.status(201).json({
      status: 201,
      message: "succes",
      token: jwt.sign({ userId: userId }),
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const GET = (req, res, next) => {
  try {
    const categories = read("categories");
    const subcategories = read("subcategories");
    const products = read("products");

    if (req.url == "/categories") {
      let changeCategories = [];
      categories.forEach((cat) => {
        let sbCat = [];
        subcategories.forEach((sub) => {
          if (sub.category_id == cat.category_id) {
            sbCat.push({
              subCategoryId: sub.sub_category_id,
              subCategoryName: sub.sub_category_name,
            });
          }
        });

        changeCategories.push({
          categoryId: cat.category_id,
          categoryName: cat.category_name,
          subCategories: sbCat,
        });
      });
      res.status(200).json(changeCategories);
    }

    if (req.url == "/categories/" + req.params.categoriesId) {
      let changeCategories = [];
      categories.forEach((cat) => {
        let sbCat = [];
        subcategories.forEach((sub) => {
          if (sub.category_id == cat.category_id) {
            sbCat.push({
              subCategoryId: sub.sub_category_id,
              subCategoryName: sub.sub_category_name,
            });
          }
        });

        changeCategories.push({
          categoryId: cat.category_id,
          categoryName: cat.category_name,
          subCategories: sbCat,
        });
      });

      changeCategories = changeCategories.find(el => el.categoryId == req.params.categoriesId)
      res.status(200).json(changeCategories);
    }

    if (req.url == "/subcategories") {
      let changeSubcategories = [];
      subcategories.forEach((sub) => {
        let subPh = [];
        products.forEach((pr) => {
          if (sub.sub_category_id == pr.sub_category_id) {
            subPh.push({
              productId: pr.product_id,
              model: pr.model,
              productName: pr.product_name,
              color: pr.color,
              price: pr.price,
            });
          }
        });

        changeSubcategories.push({
          subCategoryId: sub.sub_category_id,
          subCategoryName: sub.sub_category_name,
          products: subPh,
        });
      });
      res.status(200).json(changeSubcategories);
    }

    if (req.url == "/subcategories/" + req.params.subcategoriesId) {
      let changeSubcategories = [];
      subcategories.forEach((sub) => {
        let subPh = [];
        products.forEach((pr) => {
          if (sub.sub_category_id == pr.sub_category_id) {
            subPh.push({
              productId: pr.product_id,
              model: pr.model,
              productName: pr.product_name,
              color: pr.color,
              price: pr.price,
            });
          }
        });

        changeSubcategories.push({
          subCategoryId: sub.sub_category_id,
          subCategoryName: sub.sub_category_name,
          products: subPh,
        });
      });

      changeSubcategories = changeSubcategories.find(el => el.subCategoryId = req.params.subcategoriesId)
      
      res.status(200).json(changeSubcategories);
    }

    if (req.url == "/products/" + req.params.productId) {
      let product = products.find(
        (el) => el.product_id == req.params.productId
      );

      res.status(200).json(product);
    }

    if (req.route.path == "/products" && req.url != "/products") {
      const { categoryId, subCategoryId, model, productName, color, price } =
        req.query;

      let findProducts = [];

      if (categoryId) {
        let subId = [];

        subcategories.forEach((sub) => {
          if (categoryId == sub.category_id) {
            subId.push(sub.sub_category_id);
          }
        });

        let newFindProducts = products.forEach((pr) => {
          subId.forEach((id) => {
            if (pr.sub_category_id == id) {
              findProducts.push(pr);
            }
          });
        });
      }

      if (findProducts[0] && subCategoryId) {
        findProducts = findProducts.filter(
          (el) => el.sub_category_id == subCategoryId
        );
      } else if (subCategoryId) {
        findProducts = products.filter(
          (el) => el.sub_category_id == subCategoryId
        );
      }

      if (findProducts[0] && model) {
        findProducts = findProducts.filter((el) => el.model == model);
      } else if (model) {
        findProducts = products.filter((el) => el.model == model);
      }

      if (findProducts[0] && productName) {
        findProducts = findProducts.filter(
          (el) => el.product_name == productName
        );
      } else if (productName) {
        findProducts = products.filter((el) => el.product_name == productName);
      }

      if (findProducts[0] && color) {
        findProducts = findProducts.filter((el) => el.color == color);
      } else if (color) {
        findProducts = products.filter((el) => el.color == color);
      }

      if (findProducts[0] && price) {
        findProducts = findProducts.filter((el) => el.price == price);
      } else if (price) {
        findProducts = products.filter((el) => el.price == price);
      }

      let Response = [];

      findProducts.forEach((el) => {
        Response.push({
          productId: el.product_id,
          subCategoryId: el.sub_category_id,
          model: el.model,
          productName: el.product_name,
          color: el.color,
          price: el.price,
        });
      });

      res.status(200).json(Response);
    }
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const POST = (req, res, next) => {
  try {
    const categories = read("categories")
    const subcategories = read("subcategories")
    const products = read("products")

    if (req.url == "/categories") {

    let category_id = categories.length ? categories.at(-1).category_id + 1 : 1;
      
    let category = categories.find((category) => category.category_name == req.body.categoryName);

    if (category) {
      return next(
        new AuthorizationError(401, "This category name is already exist")
      );
    }

    req.body.category_id = category_id
    req.body.category_name = req.body.categoryName

    delete req.body.categoryName
    delete req.body.userId

    categories.push(req.body)
    write("categories", categories)
      
    res.status(201).json(categories)
    }

    if (req.url == "/subcategories") {

      let sub_category_id = subcategories.length ? subcategories.at(-1).sub_category_id + 1 : 1;
        
      let subcategory = subcategories.find((category) => category.sub_category_name == req.body.subCategoryName);
  
      if (subcategory) {
        return next(
          new AuthorizationError(401, "This sub category name is already exist")
        );
      }
  
      req.body.sub_category_id = sub_category_id
      req.body.category_id = req.body.categoryId 
      req.body.sub_category_name = req.body.subCategoryName
  
      delete req.body.subCategoryName
      delete req.body.userId
      delete req.body.categoryId
      
      subcategories.push(req.body)
      write("subcategories", subcategories)
        
      res.status(201).json(subcategories)
      }
    
      if (req.url == "/products") {

        let product_id = products.length ? products.at(-1).product_id + 1 : 1;
          
        let product = products.find((product) => product.product_name == req.body.productName);
    
        if (product) {
          return next(
            new AuthorizationError(401, "This product is already exist")
          );
        }
    
        req.body.product_id = product_id
        req.body.sub_category_id = req.body.subCategoryId 
        req.body.product_name = req.body.productName
    
        delete req.body.productName
        delete req.body.userId
        delete req.body.subCategoryId

        products.push(req.body)
        write("products", products)
          
        res.status(201).json(products)
        }

  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default { LOGIN, REGISTER, GET, POST };
