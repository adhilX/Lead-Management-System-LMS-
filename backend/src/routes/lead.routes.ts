import { Router } from 'express';
import { leadController } from '../DI/leadDI';
import { tokenChecker } from '../middlewares/auth';

import { validateLead } from '../middlewares/validation';

const router = Router();

// Protect all routes
router.use(tokenChecker);

router.post('/', validateLead, leadController.createLead);
router.get('/', leadController.getLeads);

// Place specific routes BEFORE dynamic routes like /:id
router.get('/stats/summary', leadController.getStats);

router.get('/:id', leadController.getLead);
router.patch('/:id', validateLead, leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

export default router;
