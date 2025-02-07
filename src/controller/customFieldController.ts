import { Request, Response, NextFunction } from "express";
import AdminCustomField from "../models/customFieldModel";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/responseHandler";

export const addCustomField = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fieldName, fieldType, isRequired } = req.body;

  if (!fieldName || !fieldType) {
    return sendErrorResponse(res, 400, "Field name and type are required!");
  }

  const newCustomField = new AdminCustomField({
    adminId: req.user?.userId, // Admin adding the custom field
    fieldName,
    fieldType,
    isRequired,
  });

  try {
    await newCustomField.save();
    return sendSuccessResponse(
      res,
      201,
      "Custom field added successfully",
      newCustomField
    );
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

export const getCustomFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customFields = await AdminCustomField.find({
      adminId: req.user?.userId,
    });

    return sendSuccessResponse(
      res,
      200,
      "Custom fields fetched successfully",
      customFields
    );
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// export const getCustomFields = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const adminId = req.user?.userId;
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//     // Fetch total count for pagination metadata
//     const totalCount = await AdminCustomField.countDocuments({ adminId });

//     // Fetch paginated custom fields
//     const customFields = await AdminCustomField.find({ adminId })
//       .skip(skip)
//       .limit(limit);

//     return sendSuccessResponse(res, 200, "Custom fields fetched successfully", {
//       customFields,
//       pagination: {
//         totalItems: totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//         currentPage: page,
//         pageSize: limit,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return sendErrorResponse(res, 500, "Internal Server Error");
//   }
// };

export const updateCustomField = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // Get field ID from request params
  const { fieldName, fieldType, isRequired } = req.body;
  // console.log({ fieldName, fieldType, isRequired });

  try {
    const updatedField = await AdminCustomField.findOneAndUpdate(
      { _id: id, adminId: req.user?.userId }, // Ensure only admin's fields are updated
      { fieldName, fieldType, isRequired },
      { new: true, runValidators: true }
    );

    if (!updatedField) {
      return sendErrorResponse(
        res,
        404,
        "Custom field not found or unauthorized"
      );
    }

    return sendSuccessResponse(
      res,
      200,
      "Custom field updated successfully",
      updatedField
    );
  } catch (error) {
    // console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

export const deleteCustomField = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // Get field ID from request params
  // console.log("ID",id);

  try {
    const deletedField = await AdminCustomField.findOneAndDelete({
      _id: id,
      adminId: req.user?.userId, // Ensure admin can only delete their own fields
    });

    if (!deletedField) {
      return sendErrorResponse(
        res,
        404,
        "Custom field not found or unauthorized"
      );
    }

    return sendSuccessResponse(res, 200, "Custom field deleted successfully");
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};
