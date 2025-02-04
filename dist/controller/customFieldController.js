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
exports.getCustomFields = exports.addCustomField = void 0;
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
        const customFields = yield customFieldModel_1.default.find({ adminId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
        return (0, responseHandler_1.sendSuccessResponse)(res, 200, "Custom fields fetched successfully", customFields);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.getCustomFields = getCustomFields;
