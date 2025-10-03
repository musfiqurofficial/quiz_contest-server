"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Banner_controller_1 = require("./Banner.controller");
const Banner_validation_1 = require("./Banner.validation");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(Banner_validation_1.createBannerValidationSchema), Banner_controller_1.BannerController.createBanner);
router.get('/', Banner_controller_1.BannerController.getAllBanners);
router.get('/:id', Banner_controller_1.BannerController.findBannerById);
router.patch('/:id', (0, validateRequest_1.default)(Banner_validation_1.updateBannerValidationSchema), Banner_controller_1.BannerController.updateBannerById);
router.delete('/:id', Banner_controller_1.BannerController.deleteBannerById);
exports.BannerRoutes = router;
