import { NextFunction, Request, Response } from "express";
import fs from 'fs';

/**
 * 
 * @param req request object
 * @param res response object
 * @param next next function
 * @returns void
 * @description logs the request time, method, url to the logs.txt file
 * @example
 * timeLogging(req, res, next);
 * @example
 * app.use(timeLogging);
 */
const timeLogging = (req: Request, res: Response, next: NextFunction)=>{
  const now = new Date();
  const time = now.toLocaleTimeString();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(now.getFullYear()).slice(-2); // Gets last two digits

  const log = `req time: ${time} - ${day}/${month}/${year} - method: ${req.method} - url: ${req.url} `;
  fs.appendFile('logs.txt', log + '\n', (err)=>{
    if(err){
      console.log('error', err);
    }
  });
  next();
};

export default timeLogging;