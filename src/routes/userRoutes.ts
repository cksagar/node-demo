import express, {RequestHandler } from 'express';
import { User } from '../models/User';

const router = express.Router();

// Define interface for user request body
interface UserRequestBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

// GET route to fetch all users
const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from response
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
const updateUser: RequestHandler = async (req, res) => {
  try{
    const id = req.params.id;
    const {firstname} = req.body;

    if(!id || !firstname){
      res.status(400).json({message: 'Id and firstname are required'});
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(id, {firstname}, {new: true});
    if(!updatedUser){
      res.status(404).json({message: 'User not found'});
      return;
    } 

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({message:`msg: ${err}`});
  }
};

// POST route to create user
const createUser: RequestHandler = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: 'Request body is missing' });
      return;
    }

    const { firstname, lastname, email, password } = req.body as UserRequestBody;
    if (!firstname || !lastname || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const newUser = new User({ firstname, lastname, email, password });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Routes
router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);

export default router; 