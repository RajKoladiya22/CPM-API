import express from "express";
import { Request, Response, NextFunction } from "express";
import { addCustomer, searchCustomer, deleteCustomer, updateCustomer, getRenewalReminderList } from "../../controller/customer/customerController";
import { addCustomField, getCustomFields, updateCustomField, deleteCustomField } from "../../controller/customer/customFieldController";
import { authenticateUser, authorizeRoles } from "../../middlewares/authMiddleware";
// import { addCustomerInSheeet } from "../../googleSheet/addCustomer";

const router = express.Router();

const asyncHandler = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return Promise.resolve(fn(req, res, next)).catch(next);
}

router.post("/customfield", authenticateUser, authorizeRoles("admin", "superadmin"), asyncHandler(addCustomField));

router.get("/customfield", authenticateUser, authorizeRoles("admin", "superadmin"), asyncHandler(getCustomFields));

router.put("/customfield/:id", authenticateUser, authorizeRoles("admin", "superadmin"), asyncHandler(updateCustomField));

router.delete("/customfield/:id", authenticateUser, authorizeRoles("admin", "superadmin"), asyncHandler(deleteCustomField));




router.post("/customer", authenticateUser, authorizeRoles("admin", "superadmin"), asyncHandler(addCustomer));

router.get('/customer/product', authenticateUser, authorizeRoles('admin'), asyncHandler(getRenewalReminderList));

router.get("/customer", authenticateUser, authorizeRoles("admin", "user", "superadmin"), asyncHandler(searchCustomer));

router.delete('/customer/:id', authenticateUser, authorizeRoles('admin'), asyncHandler(deleteCustomer));

router.put('/customer/:id', authenticateUser, authorizeRoles('admin'), asyncHandler(updateCustomer));



export default router;
