import dbConnect from '../../lib/dbConnect';
import CampaignHistory from '../../models/CampaignHistory';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const history = await CampaignHistory.find({})
          .sort({ dateTime: -1 })
          .limit(50);  // Limit to last 50 records
        return res.status(200).json(history);
      } catch (error) {
        console.error('Error fetching campaign history:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'POST':
      try {
        const campaignHistory = new CampaignHistory(req.body);
        await campaignHistory.save();
        return res.status(200).json({ message: 'Campaign history saved successfully' });
      } catch (error) {
        console.error('Error saving campaign history:', error);
        return res.status(500).json({ error: 'Failed to save campaign history' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
} 