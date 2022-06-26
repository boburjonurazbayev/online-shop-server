import { Router } from "express";
import controller from "../controllers/user.js";
import validation from "../middlewares/validation.js";

const router = Router();

router.post("/login", validation, controller.LOGIN);
router.post("/register", validation, controller.REGISTER);
router.post("/categories", validation, controller.POST);
router.post("/subcategories", validation, controller.POST);
router.post("/products", validation, controller.POST);

router.put("/categories", validation,  controller.PUT);
router.put("/subcategories", validation,  controller.PUT);
router.put("/products", validation,  controller.PUT);

router.get("/categories", controller.GET);
router.get("/categories/:categoriesId", controller.GET);

router.get("/subcategories", controller.GET);
router.get("/subcategories/:subcategoriesId", controller.GET);

router.get("/products", controller.GET);
router.get("/products/:productId", controller.GET);

export default router;
