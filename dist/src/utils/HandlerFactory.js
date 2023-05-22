"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoc = exports.updateDoc = exports.createDoc = exports.addDocByUser = exports.getDoc = exports.getAllDocsByUser = exports.getAllDocsByQuery = exports.getAllDocs = void 0;
const catchAsync_1 = require("../managers/catchAsync");
const APIFeatures_1 = require("./APIFeatures");
const userModel_1 = require("../models/userModel");
const AppError_1 = require("../managers/AppError");
const getAllDocs = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const features = new APIFeatures_1.default(Model.find(), req.query);
    features.filter().sort().fields().paginator();
    const docs = await features.query;
    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
});
exports.getAllDocs = getAllDocs;
const getAllDocsByQuery = (Model, query) => (0, catchAsync_1.default)(async (req, res, next) => {
    const features = new APIFeatures_1.default(Model.find(query), req.query);
    features.filter().sort().fields().paginator();
    const docs = await features.query;
    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
});
exports.getAllDocsByQuery = getAllDocsByQuery;
const getAllDocsByUser = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const userID = req.user.id;
    const features = new APIFeatures_1.default(Model.find({ user: userID }), req.query);
    features.filter().sort().fields().paginator();
    const docs = await features.query;
    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
});
exports.getAllDocsByUser = getAllDocsByUser;
const getDoc = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const doc = Model == userModel_1.default
        ? await Model.findById(req.params.userID)
        : await Model.findById(req.params.id);
    if (!doc)
        return next(new AppError_1.default('No document of this ID found', 401));
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        data: doc,
    });
});
exports.getDoc = getDoc;
const addDocByUser = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await userModel_1.default.findOne({ username: req.params.username });
    if (!user)
        return next(new AppError_1.default('No user of this username found', 401));
    const userID = user.id;
    req.body.user = userID;
    const doc = await Model.create(req.body);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        data: doc,
    });
});
exports.addDocByUser = addDocByUser;
const createDoc = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        requestedAt: req.requestedAt,
        data: doc,
    });
});
exports.createDoc = createDoc;
const updateDoc = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.userID ? req.params.userID : req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc)
        return next(new AppError_1.default('No document of this ID found', 401));
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        data: doc,
    });
});
exports.updateDoc = updateDoc;
const deleteDoc = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        requestedAt: req.requestedAt,
        data: null,
    });
});
exports.deleteDoc = deleteDoc;
//# sourceMappingURL=HandlerFactory.js.map