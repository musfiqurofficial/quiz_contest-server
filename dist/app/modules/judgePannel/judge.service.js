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
exports.ServiceJudge = void 0;
const judge_modal_1 = require("./judge.modal");
const createNewJudge = (JudgeData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const existingJudge = await JudgeModel.findOne();
        // if (existingJudge) {
        //   return {
        //     success: false,
        //     message: 'An Judge already exists.',
        //     data: existingJudge,
        //   };
        // }
        const newJudge = yield judge_modal_1.JudgeModel.create(JudgeData);
        return {
            success: true,
            message: 'Judge successfully created.',
            data: newJudge,
        };
    }
    catch (error) {
        return {
            success: false,
            message: 'Something went wrong while creating the Judge.',
            error,
        };
    }
});
const findJudgeById = (JudgeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield judge_modal_1.JudgeModel.findById(JudgeId);
});
const getAllJudge = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield judge_modal_1.JudgeModel.find();
});
const updateJudgeById = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield judge_modal_1.JudgeModel.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteJudgeById = (JudgeId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield judge_modal_1.JudgeModel.findByIdAndDelete(JudgeId);
    return result;
});
exports.ServiceJudge = {
    createNewJudge,
    getAllJudge,
    updateJudgeById,
    deleteJudgeById,
    findJudgeById,
};
