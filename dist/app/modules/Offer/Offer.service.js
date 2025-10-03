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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOfOffer = void 0;
const Offer_modal_1 = require("./Offer.modal");
// const createOffer = async (OfferService: IOffer) => {
//   return await Offer.create(OfferService);
// };
const createOffer = (offerData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingOffer = yield Offer_modal_1.Offer.findOne();
        if (existingOffer) {
            return {
                success: false,
                message: 'An offer already exists.',
                data: existingOffer,
            };
        }
        const newOffer = yield Offer_modal_1.Offer.create(offerData);
        return {
            success: true,
            message: 'Offer successfully created.',
            data: newOffer,
        };
    }
    catch (error) {
        return {
            success: false,
            message: 'Something went wrong while creating the offer.',
            error,
        };
    }
});
const findeOfferById = (OfferId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Offer_modal_1.Offer.findById(OfferId);
});
const getAllOffers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Offer_modal_1.Offer.find();
});
// const updateOfferById = async (_id: string, payload: Partial<IOffer>) => {
//   const result = await Offer.findByIdAndUpdate(_id, payload, {
//     new: true,
//     runValidators: true,
//   });
//   return result;
// };
const updateOfferById = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Offer_modal_1.Offer.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteOfferById = (OfferId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Offer_modal_1.Offer.findByIdAndDelete(OfferId);
    return result;
});
exports.ServiceOfOffer = {
    createOffer,
    getAllOffers,
    updateOfferById,
    deleteOfferById,
    findeOfferById,
};
