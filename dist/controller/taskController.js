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
exports.updateTaskStatus = exports.deleteTask = exports.updateTask = exports.getUserTasks = exports.getTasksByAdmin = exports.assignTask = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel"));
const responseHandler_1 = require("../utils/responseHandler");
// Admin assigns a task to a user
const assignTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, assignedTo, deadline } = req.body;
        if (!title || !description || !assignedTo || !deadline) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "All fields are required");
        }
        const newTask = new taskModel_1.default({
            title,
            description,
            assignedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            assignedTo,
            deadline,
            status: "Pending",
        });
        yield newTask.save();
        return (0, responseHandler_1.sendSuccessResponse)(res, 201, "Task assigned successfully", newTask);
    }
    catch (error) {
        next(error);
    }
});
exports.assignTask = assignTask;
// Get tasks assigned by an admin
const getTasksByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tasks = yield taskModel_1.default.find({ assignedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }).populate("assignedTo", "username email");
        return (0, responseHandler_1.sendSuccessResponse)(res, 200, "Tasks retrieved successfully", tasks);
    }
    catch (error) {
        next(error);
    }
});
exports.getTasksByAdmin = getTasksByAdmin;
// Get tasks assigned to a user
const getUserTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tasks = yield taskModel_1.default.find({ assignedTo: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
        return (0, responseHandler_1.sendSuccessResponse)(res, 200, "User tasks retrieved successfully", tasks);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserTasks = getUserTasks;
// Update task (Admin can update task details)
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { title, description, deadline } = req.body;
        const updatedTask = yield taskModel_1.default.findOneAndUpdate({ _id: id, assignedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }, { title, description, deadline }, { new: true, runValidators: true });
        if (!updatedTask) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Task not found or unauthorized");
        }
        return (0, responseHandler_1.sendSuccessResponse)(res, 200, "Task updated successfully", updatedTask);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTask = updateTask;
// Delete task (Admin can delete task)
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const deletedTask = yield taskModel_1.default.findOneAndDelete({ _id: id, assignedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
        if (!deletedTask) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Task not found or unauthorized");
        }
        return (0, responseHandler_1.sendSuccessResponse)(res, 200, "Task deleted successfully");
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTask = deleteTask;
// User updates task status and records timestamps
const updateTaskStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["Pending", "InProgress", "Completed"].includes(status)) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "Invalid status value");
        }
        const updateFields = { status };
        if (status === "InProgress") {
            updateFields.progressAt = new Date(); // Save timestamp when moved to "InProgress"
        }
        else if (status === "Completed") {
            updateFields.completedAt = new Date(); // Save timestamp when moved to "Completed"
        }
        const updatedTask = yield taskModel_1.default.findOneAndUpdate({ _id: id, assignedTo: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }, updateFields, { new: true, runValidators: true });
        if (!updatedTask) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Task not found or unauthorized");
        }
        return (0, responseHandler_1.sendSuccessResponse)(res, 200, "Task status updated successfully", updatedTask);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTaskStatus = updateTaskStatus;
