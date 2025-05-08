import { Request, Response, NextFunction } from 'express';

export const validateQueryParams = (allowedParams: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const invalidParams = Object.keys(req.query)
            .filter(param => !allowedParams.includes(param));

        if (invalidParams.length > 0) {
            return res.status(400).json({
                error: `Invalid query parameters: ${invalidParams.join(', ')}`,
                allowedParameters: allowedParams
            });
        }
        next();
    };
};