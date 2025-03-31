import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../lib/mongodb';
import { News } from '../../models';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  await dbConnect();

  try {
    if (req.method === 'DELETE') {
      const deletedNews = await News.findByIdAndDelete(id);
      if (!deletedNews) {
        return res.status(404).json({ error: 'News item not found' });
      }
      res.status(200).json({ message: 'News deleted successfully' });
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in news delete API:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
} 