import express, { RequestHandler } from 'express';
import { nanoid } from 'nanoid';
import { Url } from '../models/url';

const router = express.Router();
// POST route to create user

const createShortUrl: RequestHandler = async (req, res) => {
  const shortId = nanoid(8);
  try {
    let { redirectUrl } = req.body;

    if (!redirectUrl) {
      res.status(400).json({ message: 'Url is missing' });
      return;
    }

    // Auto-correct missing protocol
    if (!/^https?:\/\//i.test(redirectUrl)) {
      redirectUrl = 'https://' + redirectUrl;
    }

    const newUrl = new Url({
      shortUrl: shortId,
      redirectUrl,
      clickHistory: [],
    });
    await newUrl.save();
    res.render('homepage', { id: shortId });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getShortUrl: RequestHandler = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    const entry = await Url.findOneAndUpdate(
      { shortUrl },
      { $push: { clickHistory: { timeStamp: Date.now() } } },
    );
    if (entry?.redirectUrl) {
      res.redirect(entry.redirectUrl);
    } else {
      res.status(404).json({ message: 'Short URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getViewAnalytics: RequestHandler = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;

    const entry = await Url.findOne({ shortUrl });

    if (entry?.clickHistory.length) {
      res.render('clickHistory', {
        shortUrl,
        clickHistory: entry.clickHistory,
      });
    } else {
      res.status(404).json({ message: 'Short URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

router.get('/:shortUrl', getShortUrl);
router.get('/analytics/:shortUrl', getViewAnalytics);
router.post('/', createShortUrl);

export default router;
