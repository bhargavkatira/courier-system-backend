import axios from "axios";
import config from "../../config";
import { redisConnection } from "../../config/redis";

let token: string | null = null;
let tokenExpiry: number = 0;
const baseURL = config.BASE_URL;

export const setToken = async (token: string, expiresIn: number) => {
  console.log("setToken called");

  const res = await redisConnection.set(
    "ub_token",
    token,
    "EX",
    expiresIn
  );

  console.log("Redis SET response:", res);

  const stored = await redisConnection.get("ub_token");
  console.log("Stored token:", stored);
};


export const isTokenExpired = (): boolean => {
  return !token || Date.now() > tokenExpiry;
};

export const getToken = async (): Promise<string> => {
  const existingToken = await getStoredToken();
  if (existingToken) return existingToken;

  const res = await axios.post(
    `${baseURL}/auth/getToken/`,
    {
      username: process.env.UB_USERNAME,
      password: process.env.UB_PASSWORD
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const newToken = res.data.access_token;


  await redisConnection.set("test_key", "hello");
  const val = await redisConnection.get("test_key");
  
  await setToken(newToken, 23 * 60 * 60);

  return newToken;
};
export const getStoredToken = async () => {
  return await redisConnection.get("ub_token");
};