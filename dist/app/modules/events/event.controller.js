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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.getEventWithParticipants = exports.addParticipant = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const event_model_1 = require("./event.model");
// Create Event
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_model_1.Event.create(req.body);
        // await event.updateStatus();
        res.status(201).json({ success: true, data: event });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createEvent = createEvent;
// Get all Events
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_model_1.Event.find().populate('quizzes');
        res.json({ success: true, data: events });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getEvents = getEvents;
// Get single Event
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.id;
        const event = yield event_model_1.Event.findById(eventId).populate('quizzes');
        if (!event) {
            return res
                .status(404)
                .json({ success: false, message: 'Event not found' });
        }
        res.json({ success: true, data: event });
    }
    catch (error) {
        console.error('Error loading event:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getEventById = getEventById;
// Update Event
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_model_1.Event.findById(req.params.id);
        if (!event)
            return res
                .status(404)
                .json({ success: false, message: 'Event not found' });
        Object.assign(event, req.body);
        // if (typeof event.updateStatus === 'function') {
        //   await event.updateStatus();
        // }
        yield event.save();
        res.json({ success: true, data: event });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
        else {
            res
                .status(400)
                .json({ success: false, message: 'An unknown error occurred' });
        }
    }
});
exports.updateEvent = updateEvent;
// Add participant to event
const addParticipant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, studentId } = req.body;
        // Validate required fields
        if (!eventId || !studentId) {
            return res.status(400).json({
                success: false,
                message: 'Event ID and Student ID are required',
            });
        }
        const event = yield event_model_1.Event.findById(eventId);
        if (!event) {
            return res
                .status(404)
                .json({ success: false, message: 'Event not found' });
        }
        // Convert studentId to ObjectId for proper comparison
        const studentObjectId = new mongoose_1.default.Types.ObjectId(studentId);
        // Check if student is already a participant using ObjectId comparison
        const isAlreadyParticipant = event.participants.some((participantId) => {
            return (participantId.toString() === studentObjectId.toString() ||
                (participantId &&
                    participantId.equals &&
                    participantId.equals(studentObjectId)));
        });
        if (isAlreadyParticipant) {
            // Return success even if already a participant
            const populatedEvent = yield event_model_1.Event.findById(eventId)
                .populate('quizzes')
                .populate('participants', 'fullNameEnglish fullNameBangla contact role');
            return res.json({
                success: true,
                data: populatedEvent,
                message: 'Student is already a participant',
            });
        }
        // Add student to participants array
        event.participants.push(studentObjectId);
        yield event.save();
        // Populate and return event with participant details
        const populatedEvent = yield event_model_1.Event.findById(eventId)
            .populate('quizzes')
            .populate('participants', 'fullNameEnglish fullNameBangla contact role');
        res.json({ success: true, data: populatedEvent });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.addParticipant = addParticipant;
// Get event with participants
const getEventWithParticipants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_model_1.Event.findById(req.params.id)
            .populate('quizzes')
            .populate('participants', 'fullNameEnglish fullNameBangla contact role');
        if (!event) {
            return res
                .status(404)
                .json({ success: false, message: 'Event not found' });
        }
        res.json({ success: true, data: event });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getEventWithParticipants = getEventWithParticipants;
// Delete Event
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_model_1.Event.findById(req.params.id);
        if (!event)
            return res
                .status(404)
                .json({ success: false, message: 'Event not found' });
        yield event.deleteOne();
        res.json({ success: true, message: 'Event deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteEvent = deleteEvent;
