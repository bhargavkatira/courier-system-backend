import axios from "axios";
import { redisConnection } from "../../config/redis";
import { isTokenExpired, setToken } from "./auth.service";


let token: string | null = null;
let tokenExpiry: number = 0;
let baseURI = process.env.URBAN_EBOLT_BASE_URL

// export const createShipment = async (order: any) => {
//   let token = await getToken();

//   try {
//     const res = await axios.post(
//       `${baseURI}/createShipment/`,
//       order,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     return res.data;

//   } catch (err: any) {
//     if (err.response?.status === 401) {
//       console.log("Token expired, refreshing...");

//       await redisConnection.del("ub_token");

//       token = await getToken();

//       const retry = await axios.post(
//         `${baseURI}/createShipment/`,
//         order,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       return retry.data;
//     }

//     throw err;
//   }
// };

export const getToken = async () => {
  if (!isTokenExpired()) return token;

  const res = await axios.post(`${baseURI}/login`, {
    username: process.env.UB_USERNAME,
    password: process.env.UB_PASSWORD
  });

  const newToken = res.data.access_token;

  // assume 24 hours expiry
  setToken(newToken, 24 * 60 * 60);

  return newToken;
};