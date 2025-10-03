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
exports.TimeInstructionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const timeInstruction_service_1 = require("./timeInstruction.service");
const createTimeInstruction = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield timeInstruction_service_1.ServiceTimeInstruction.createTimeInstruction(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Time Instruction created Successfully',
        data: result,
    });
}));
const findCreateTimeInstructionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield timeInstruction_service_1.ServiceTimeInstruction.findTimeInstructionById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Successfully retrive single Offer',
        success: true,
        data: result,
    });
}));
const getAllTimeInstruction = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield timeInstruction_service_1.ServiceTimeInstruction.getAllTimeInstruction();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Successfully retrived All Time Instruction',
        success: true,
        data: result,
    });
}));
const updateTimeInstructionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield timeInstruction_service_1.ServiceTimeInstruction.updateTimeInstructionById(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offer is updated successfully',
        data: result,
    });
}));
const deleteTimeInstructionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield timeInstruction_service_1.ServiceTimeInstruction.deleteTimeInstructionById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Successfully update offer',
        data: result,
    });
}));
exports.TimeInstructionController = {
    createTimeInstruction,
    findCreateTimeInstructionById,
    getAllTimeInstruction,
    updateTimeInstructionById,
    deleteTimeInstructionById,
};
