import dotenv from "dotenv";
dotenv.config();

const config = {
    MONGO_URI : process.env.MONGO_URI,
    BASE_URL : process.env.URBAN_EBOLT_BASE_URL

}

export default config;