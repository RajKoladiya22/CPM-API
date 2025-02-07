"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomField = exports.updateCustomField = exports.getCustomFields = exports.addCustomField = void 0;
const customFieldModel_1 = __importDefault(require("../models/customFieldModel"));
const responseHandler_1 = require("../utils/responseHandler");
const addCustomField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { fieldName, fieldType, isRequired } = req.body;
    if (!fieldName || !fieldType) {
        return (0, responseHandler_1.sendErrorResponse)(res, 400, "Field name and type are required!");
    }
    const newCustomField = new customFieldModel_1.default({
        adminId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, // Admin adding the custom field
        fieldName,
        fieldType,
        isRequired,
    });
    try {
        yield newCustomField.save();
        return (0, responseHandler_1.sendSuccessResponse)(res, 201, "Custom field added successfully", newCustomField);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.addCustomField = addCustomField;
const getCustomFields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customFields = yield customFieldModel_1.default.find({
            adminId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        });
        return (0, responseHandler_1.sendSuccessResponse)(res, 200, "Custom fields fetched successfully", customFields);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.getCustomFields = getCustomFields;
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
const updateCustomField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params; // Get field ID from request params
    const { fieldName, fieldType, isRequired } = req.body;
    // console.log({ fieldName, fieldType, isRequired });
    try {
        const updatedField = yield customFieldModel_1.default.findOneAndUpdate({ _id: id, adminId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }, // Ensure only admin's fields are updated
        { fieldName, fieldType, isRequired }, { new: true, runValidators: true });
        if (!updatedField) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Custom field not found or unauthorized");
        }
        return (0, responseHandler_1.sendSuccessResponse)(res, 200, "Custom field updated successfully", updatedField);
    }
    catch (error) {
        // console.error(error);
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.updateCustomField = updateCustomField;
const deleteCustomField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params; // Get field ID from request params
    // console.log("ID",id);
    try {
        const deletedField = yield customFieldModel_1.default.findOneAndDelete({
            _id: id,
            adminId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, // Ensure admin can only delete their own fields
        });
        if (!deletedField) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Custom field not found or unauthorized");
        }
        return (0, responseHandler_1.sendSuccessResponse)(res, 200, "Custom field deleted successfully");
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.deleteCustomField = deleteCustomField;
