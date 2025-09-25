import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();


export const createOAuthClient = () => {
return new google.auth.OAuth2(
process.env.GOOGLE_CLIENT_ID,
process.env.GOOGLE_CLIENT_SECRET,
process.env.GOOGLE_REDIRECT_URI
);
};


export const CLASSROOM_SCOPES = [
'openid',
'email',
'profile',
'https://www.googleapis.com/auth/classroom.courses.readonly',
'https://www.googleapis.com/auth/classroom.rosters.readonly',
'https://www.googleapis.com/auth/classroom.coursework.me.readonly'
];
