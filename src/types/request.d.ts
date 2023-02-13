import { UserDocument } from "../models/userModel";

declare global{
    namespace Express {
        export interface Request {
            requestedAt: string,
            user:UserDocument
        }
    }
}
