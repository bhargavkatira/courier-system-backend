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
  const stored = await redisConnection.get("ub_token");
};


export const isTokenExpired = (): boolean => {
  return !token || Date.now() > tokenExpiry;
};

export const getToken = async ()=> {
  const existingToken = await getStoredToken();
  console.log(existingToken, 27)
  if (existingToken) return existingToken;

  // const lock = await redisConnection.set(
  //   "ub_token_lock",
  //   "1",
  //   "EX",
  //   10,
  //   "NX"
  // );

  // if (!lock) {
  //   await new Promise((res) => setTimeout(res, 200));
  //   return getToken();
  // }

  try {
    const tokenAfterLock = await getStoredToken();
    if (tokenAfterLock) return tokenAfterLock;
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
  }catch(error: any){
    console.log(error?.message);
    return null;
  }

};
export const getStoredToken = async () => {
  return await redisConnection.get("ub_token");
};