import * as sharp from 'sharp';
import * as fs from 'fs';
import slugify from 'slugify';
import logger from '../../../logs/logger';
import { NextFunction, Request, Response } from 'express';
import User from '../../models/userModel';

export const resizePic = async (
    picPath: string,
    toPath: string,
    d1: number,
    d2: number
): Promise<void> => {
    try {
        const buffer = await fs.promises.readFile(picPath);

        await sharp(buffer)
            .resize(d1, d2)
            .toFormat('jpeg')
            .jpeg({ quality: 100 })
            .toFile(toPath);

        await fs.promises.unlink(picPath);
    } catch (err) {
        logger.error(`Error in Resizing ${picPath}: ${err.message}`);
    }
};

export const resizeUserPic = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) return next();

    const picPath = `${req.file.destination}/${req.file.filename}`;
    const toPath = `public/users/${req.file.fieldname}s/${slugify(
        req.user ? req.user.username : req.body.username
    )}-${Date.now()}.jpeg`;

    resizePic(picPath, toPath, 500, 500);

    req.body.profilePic = toPath.split('/')[3];

    if (req.user) {
        const user = await User.findById(req.user.id);

        const picPath = `public/users/${req.file.fieldname}s/${user.profilePic}`;
        if (user.profilePic !== 'default.jgp') {
            fs.unlinkSync(picPath);
        }
    }

    next();
};
