import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import wishlistRouter from "./wishlist.js";
import paymentsRouter from "./payments.js";
import adminRouter from "./admin.js";
import seedRouter from "./seed.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(wishlistRouter);
router.use(paymentsRouter);
router.use(adminRouter);
router.use(seedRouter);

export default router;
