import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  /**
   * GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
   */
  getAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { from, to } = req.query;

      if (!from || !to) {
        res.status(400).json({ error: 'Query parameters "from" and "to" are required (format: YYYY-MM-DD)' });
        return;
      }

      const analytics = this.analyticsService.getAnalytics(
        from as string,
        to as string
      );

      res.json(analytics);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}

