import { Request, Response, NextFunction } from 'express';
import { ILeadService } from '../interfaces/Iservice/ILead.service';
import { STATUS_CODES } from '../constants/statusCodes';

export class LeadController {
    constructor(private leadService: ILeadService) { }

    createLead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // req.user is attached by auth middleware
            const lead = await this.leadService.createLead(req.user.id, req.body);
            res.status(STATUS_CODES.CREATED).json({ message: 'Lead created successfully', lead });
        } catch (error) {
            next(error);
        }
    };

    getLeads = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.leadService.getLeads(req.user.id, req.query);
            res.status(STATUS_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    };

    getLead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lead = await this.leadService.getLead(req.user.id, req.params.id as string);
            res.status(STATUS_CODES.OK).json({ lead });
        } catch (error) {
            next(error);
        }
    };

    updateLead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lead = await this.leadService.updateLead(req.user.id, req.params.id as string, req.body);
            res.status(STATUS_CODES.OK).json({ message: 'Lead updated successfully', lead });
        } catch (error) {
            next(error);
        }
    };

    deleteLead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.leadService.deleteLead(req.user.id, req.params.id as string);
            res.status(STATUS_CODES.OK).json({ message: 'Lead deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    getStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await this.leadService.getStats(req.user.id, req.query);
            res.status(STATUS_CODES.OK).json(stats);
        } catch (error) {
            next(error);
        }
    };
}
