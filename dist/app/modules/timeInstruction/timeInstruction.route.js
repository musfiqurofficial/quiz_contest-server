"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeInstructionRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const timeInstruction_validation_1 = require("./timeInstruction.validation");
const timeInstruction_controller_1 = require("./timeInstruction.controller");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(timeInstruction_validation_1.TimeInstructionValidation.createTimeInstructionValidationSchema), timeInstruction_controller_1.TimeInstructionController.createTimeInstruction);
router.get('/', timeInstruction_controller_1.TimeInstructionController.getAllTimeInstruction);
router.get('/:id', timeInstruction_controller_1.TimeInstructionController.findCreateTimeInstructionById);
router.patch('/:id', (0, validateRequest_1.default)(timeInstruction_validation_1.TimeInstructionValidation === null || timeInstruction_validation_1.TimeInstructionValidation === void 0 ? void 0 : timeInstruction_validation_1.TimeInstructionValidation.updateTimeInstructionValidationSchema), timeInstruction_controller_1.TimeInstructionController.updateTimeInstructionById);
router.delete('/:id', timeInstruction_controller_1.TimeInstructionController.deleteTimeInstructionById);
exports.TimeInstructionRouter = router;
