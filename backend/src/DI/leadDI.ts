import { LeadController } from '../controllers/lead.controller';
import { LeadRepository } from '../repositories/lead.repo';
import { LeadService } from '../services/lead.services';

const leadRepo = new LeadRepository();
const leadService = new LeadService(leadRepo);
const leadController = new LeadController(leadService);

export { leadController };
