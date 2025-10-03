"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionRouter = void 0;
const express_1 = require("express");
const questions_controller_1 = require("./questions.controller");
const questionUpload_1 = require("../../config/questionUpload");
const QuestionRouter = (0, express_1.Router)();
exports.QuestionRouter = QuestionRouter;
// Basic CRUD operations (order matters: place specific routes before ":id")
QuestionRouter.post('/', questions_controller_1.createQuestion);
QuestionRouter.post('/bulk', questions_controller_1.bulkCreateQuestions);
QuestionRouter.delete('/bulk', questions_controller_1.bulkDeleteQuestions);
QuestionRouter.get('/', questions_controller_1.getQuestions);
// Specific routes first
QuestionRouter.get('/quiz/:quizId', questions_controller_1.getQuestionsByQuizId);
QuestionRouter.get('/type/:type', questions_controller_1.getQuestionsByType);
// Generic ID routes
QuestionRouter.get('/:id', questions_controller_1.getQuestionById);
QuestionRouter.put('/:id', questions_controller_1.updateQuestion);
QuestionRouter.delete('/:id', questions_controller_1.deleteQuestion);
// Image upload routes
QuestionRouter.post('/upload-images', questionUpload_1.questionImageUpload.array('images', 5), questions_controller_1.uploadQuestionImages);
QuestionRouter.put('/:questionId/images', questions_controller_1.updateQuestionWithImages);
// Answer submission routes
QuestionRouter.post('/:questionId/submit-answer', questionUpload_1.questionImageUpload.array('images', 5), questions_controller_1.submitAnswer);
