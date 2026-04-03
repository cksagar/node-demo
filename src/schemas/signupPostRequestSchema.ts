import { z } from 'zod';

const signupPostRequestSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(3),
});

export default signupPostRequestSchema;
