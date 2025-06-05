import express, { RequestHandler } from 'express';

const router = express.Router();

const homeHandler: RequestHandler = async (req, res) => {
  try {
    res.render('homepage');
  } catch (error) {
    console.log(error);
  }
};

router.get('/', homeHandler);

export default router;
