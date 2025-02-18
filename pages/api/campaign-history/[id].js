import dbConnect from '../../../lib/dbConnect';
import CampaignHistory from '../../../models/CampaignHistory';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const deletedCampaign = await CampaignHistory.findByIdAndDelete(id);
    
    if (!deletedCampaign) {
      return res.status(404).json({ message: 'Campaign history not found' });
    }

    return res.status(200).json({ message: 'Campaign history deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign history:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 