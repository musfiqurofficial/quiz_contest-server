"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Offer_validation_1 = require("./Offer.validation");
const Offer_controller_1 = require("./Offer.controller");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(Offer_validation_1.OfferValidation.createOfferValidationSchema), Offer_controller_1.OfferController.createOffer);
router.get('/', Offer_controller_1.OfferController.getAllOffers);
router.get('/:id', Offer_controller_1.OfferController.findeOfferById);
router.patch('/:id', (0, validateRequest_1.default)(Offer_validation_1.OfferValidation === null || Offer_validation_1.OfferValidation === void 0 ? void 0 : Offer_validation_1.OfferValidation.updateOfferValidationSchema), Offer_controller_1.OfferController.updateOfferById);
router.delete('/:id', Offer_controller_1.OfferController.deleteOfferById);
exports.OfferRouter = router;
