import Joi from "joi";

export const loginScheme = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const registerScheme = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
});

export const postCategories = Joi.object({
  userId: Joi.required(),
  categoryName: Joi.string().alphanum().min(2).max(50).required(),
});

export const postSubCategories = Joi.object({
  userId: Joi.required(),
  categoryId: Joi.string().required(),
  subCategoryName: Joi.string().alphanum().min(2).max(50).required(),
});

export const postProducts = Joi.object({
  userId: Joi.required(),
  subCategoryId: Joi.string().required(),
  productName: Joi.string().alphanum().min(2).max(50).required(),
  price: Joi.string().required(),
  color: Joi.string().required(),
  model: Joi.string().required(),
});

export const putProducts = Joi.object({
  userId: Joi.required(),
  productId: Joi.string().required(),
  productName: Joi.string().alphanum().min(2).max(50).required(),
});

export const putSubCategories = Joi.object({
  userId: Joi.required(),
  subCategoryId: Joi.string().required(),
  subCategoryName: Joi.string().alphanum().min(2).max(50).required(),
});

export const putCategories = Joi.object({
  userId: Joi.required(),
  categoryId: Joi.string().required(),
  categoryName: Joi.string().alphanum().min(2).max(50).required(),
});
