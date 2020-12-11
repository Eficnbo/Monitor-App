import { Pool } from "../deps.js";
import { config } from "../config/config.js";


const CONCURRENT_CONNECTIONS = 3;
const DATABASE_URL = Deno.env.toObject().DATABASE_URL;
const connectionPool = new Pool(DATABASE_URL, CONCURRENT_CONNECTIONS);

const executeQuery = async(query, ...params) => {
  const client = await connectionPool.connect();
  try {
      return await client.query(query, ...params);
  } catch (e) {
      console.log(e);  
  } finally {
      client.release();
  }
  
  return null;
};

export { executeQuery };
