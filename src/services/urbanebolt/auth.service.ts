// src/services/urbanebolt/auth.service.ts

import axios from "axios";
import { redisConnection } from "../../config/redis";

let token: string | null = null;
let tokenExpiry: number = 0;
let baseURI = process.env.URBAN_EBOLT_BASE_URL


export const setToken = async (token: string, expiresIn: number) => {
  console.log("🔥 setToken called");

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
  console.log(existingToken, 34)
  if (existingToken) return existingToken;

  const res = await axios.post(
    "https://uat.urbanebolt.in/api/v1/auth/getToken/",
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

  // store for 24 hours
  console.log(newToken, 45);

  await redisConnection.set("test_key", "hello");
  const val = await redisConnection.get("test_key");
  
  await setToken(newToken, 23 * 60 * 60);

  return newToken;
};
export const getStoredToken = async () => {
  return await redisConnection.get("ub_token");
};