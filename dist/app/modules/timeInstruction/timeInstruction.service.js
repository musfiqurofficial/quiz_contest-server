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
exports.ServiceTimeInstruction = void 0;
const timeInstruction_modal_1 = require("./timeInstruction.modal");
const createTimeInstruction = (TimeInstructionData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const existingTimeInstruction = await TimeInstructionModal.findOne();
        // if (existingTimeInstruction) {
        //   return {
        //     success: false,
        //     message: 'An TimeInstruction already exists.',
        //     data: existingTimeInstruction,
        //   };
        // }
        const newTimeInstruction = yield timeInstruction_modal_1.TimeInstructionModal.create(TimeInstructionData);
        return {
            success: true,
            message: 'TimeInstruction successfully created.',
            data: newTimeInstruction,
        };
    }
    catch (error) {
        return {
            success: false,
            message: 'Something went wrong while creating the TimeInstruction.',
            error,
        };
    }
});
const findTimeInstructionById = (TimeInstructionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield timeInstruction_modal_1.TimeInstructionModal.findById(TimeInstructionId);
});
const getAllTimeInstruction = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield timeInstruction_modal_1.TimeInstructionModal.find();
});
const updateTimeInstructionById = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield timeInstruction_modal_1.TimeInstructionModal.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteTimeInstructionById = (TimeInstructionId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield timeInstruction_modal_1.TimeInstructionModal.findByIdAndDelete(TimeInstructionId);
    return result;
});
exports.ServiceTimeInstruction = {
    createTimeInstruction,
    getAllTimeInstruction,
    updateTimeInstructionById,
    deleteTimeInstructionById,
    findTimeInstructionById,
};
