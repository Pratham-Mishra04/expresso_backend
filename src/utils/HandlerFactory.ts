import catchAsync from '../managers/catchAsync';
import APIFeatures from './APIFeatures';
import User from '../models/userModel';
import AppError from '../managers/AppError';
import { NextFunction, Request, Response } from 'express';

export const getAllDocs = (Model) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const features = new APIFeatures(Model.find(), req.query);

        features.filter().sort().fields().paginator();

        const docs = await features.query;

        res.status(200).json({
            status: 'success',
            message:"Docs Fetched",
            results: docs.length,
            requestedAt: req.requestedAt,
            data: docs,
        });
    });

export const getAllDocsByQuery = (Model, query) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const features = new APIFeatures(Model.find(query), req.query);

        features.filter().sort().fields().paginator();

        const docs = await features.query;

        res.status(200).json({
            status: 'success',
            message:"Docs Fetched",
            results: docs.length,
            requestedAt: req.requestedAt,
            data: docs,
        });
    });

export const getAllDocsByUser = (Model) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userID = req.user.id;
        const features = new APIFeatures(
            Model.find({ user: userID }),
            req.query
        );

        features.filter().sort().fields().paginator();

        const docs = await features.query;

        res.status(200).json({
            status: 'success',
            message:"Docs Fetched",
            results: docs.length,
            requestedAt: req.requestedAt,
            data: docs,
        });
    });

export const getDoc = (Model) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const doc =
            Model == User
                ? await Model.findById(req.params.userID)
                : await Model.findById(req.params.id);
        if (!doc)
            return next(new AppError('No document of this ID found', 401));
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Doc Fetched",
            doc,
        });
    });

export const addDocByUser = (Model) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findOne({ username: req.params.username });
        if (!user)
            return next(new AppError('No user of this username found', 401));
        const userID = user.id;
        req.body.user = userID;
        const doc = await Model.create(req.body);
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Doc Created",
            data: doc,
        });
    });

export const createDoc = (Model) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Doc Created",
            data: doc,
        });
    });

export const updateDoc = (Model) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Model.findByIdAndUpdate(
            req.params.userID ? req.params.userID : req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!doc)
            return next(new AppError('No document of this ID found', 401));

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Doc Updated",
            doc,
        });
    });

export const deleteDoc = (Model) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await Model.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Doc Deleted",
            data: null,
        });
    });
