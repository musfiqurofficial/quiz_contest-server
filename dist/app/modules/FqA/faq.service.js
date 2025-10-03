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
exports.ServiceOfFaQ = void 0;
const faq_modal_1 = require("./faq.modal");
// const createFaQ = async (FaQService: IFaQ) => {
//   return await FaQ.create(FaQService);
// };
const createFaQ = (FaQData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingFaQ = yield faq_modal_1.FaQ.findOne();
        if (existingFaQ) {
            return {
                success: false,
                message: 'An FaQ already exists.',
                data: existingFaQ,
            };
        }
        const newFaQ = yield faq_modal_1.FaQ.create(FaQData);
        return {
            success: true,
            message: 'FaQ successfully created.',
            data: newFaQ,
        };
    }
    catch (error) {
        return {
            success: false,
            message: 'Something went wrong while creating the FaQ.',
            error,
        };
    }
});
const findFaQById = (FaQId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield faq_modal_1.FaQ.findById(FaQId);
});
const getAllFaQs = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield faq_modal_1.FaQ.find();
});
// const updateFaQById = async (_id: string, payload: Partial<IFaQ>) => {
//   const result = await FaQ.findByIdAndUpdate(_id, payload, {
//     new: true,
//     runValidators: true,
//   });
//   return result;
// };
const updateFaQById = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_modal_1.FaQ.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteFaQById = (FaQId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_modal_1.FaQ.findByIdAndDelete(FaQId);
    return result;
});
exports.ServiceOfFaQ = {
    createFaQ,
    getAllFaQs,
    updateFaQById,
    deleteFaQById,
    findFaQById,
};
