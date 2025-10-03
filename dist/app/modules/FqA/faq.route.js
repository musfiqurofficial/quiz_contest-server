"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaQRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faq_validation_1 = require("./faq.validation");
const faq_controller_1 = require("./faq.controller");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(faq_validation_1.FaQValidation.createFaQValidationSchema), faq_controller_1.FaQController.createFaQ);
router.get('/', faq_controller_1.FaQController.getAllFaQs);
router.get('/:id', faq_controller_1.FaQController.findFaQById);
router.patch('/:id', (0, validateRequest_1.default)(faq_validation_1.FaQValidation === null || faq_validation_1.FaQValidation === void 0 ? void 0 : faq_validation_1.FaQValidation.updateFaQValidationSchema), faq_controller_1.FaQController.updateFaQById);
router.delete('/:id', faq_controller_1.FaQController.deleteFaQById);
exports.FaQRouter = router;
