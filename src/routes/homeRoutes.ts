import express, { RequestHandler } from 'express';
import { User, UserRequestBody } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import { setUser } from '../service/auth';
const router = express.Router();

const homeHandler: RequestHandler = async (req, res) => {
  try {
    res.render('homepage');
  } catch (error) {
    console.log(error);
  }
};

const signupPageHandler: RequestHandler = async (req, res) => {
  try {
    res.render('signup', { error: null }); // ✅ Always pass `error`
  } catch (error) {
    console.log(error);
    res.render('signup', { error: 'Unexpected error loading form' });
  }
};

const loginPageHandler: RequestHandler = async (req, res) => {
  try {
    res.render('login', { error: null }); // ✅ Always pass `error`
  } catch (error) {
    console.log(error);
    res.render('login', { error: 'Unexpected error loading form' });
  }
};

const loginHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    console.log('user', user);

    if (!user) {
      return res.render('login', { error: 'no user found' });
    }

    const sessionId = uuidv4();
    setUser(sessionId, user as UserRequestBody);
    res.cookie('uid', sessionId);
    return res.redirect('/');
  } catch (error) {
    res.send(error);
  }
};

router.get('/', homeHandler);
router.get('/signup', signupPageHandler);
router.get('/login', loginPageHandler);
router.post('/login', loginHandler);

export default router;
