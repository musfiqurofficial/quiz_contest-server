"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgesRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const judge_validation_1 = require("./judge.validation");
const judge_controller_1 = require("./judge.controller");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(judge_validation_1.JudgeValidation.createJudgeValidationSchema), judge_controller_1.JudgeController.createJudge);
router.get('/', judge_controller_1.JudgeController.getAllJudge);
router.get('/:id', judge_controller_1.JudgeController.findCreateJudgeById);
router.patch('/:id', (0, validateRequest_1.default)(judge_validation_1.JudgeValidation === null || judge_validation_1.JudgeValidation === void 0 ? void 0 : judge_validation_1.JudgeValidation.updateJudgeValidationSchema), judge_controller_1.JudgeController.updateJudgeById);
router.delete('/:id', judge_controller_1.JudgeController.deleteJudgeById);
exports.JudgesRouter = router;
