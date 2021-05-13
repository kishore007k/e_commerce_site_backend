import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_TIME = process.env.JWT_ACCESS_TIME;

export const JWT_REFRESH = process.env.JWT_REFRESH_SECRET;
export const JWT_R_TIME = process.env.JWT_REFRESH_TIME;

export const PASSWORD_SECRET = process.env.PASSWORD_RESET_SECRET;
