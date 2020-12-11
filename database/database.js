import { Pool } from "../deps.js";
import { dataConfig } from "../config/config.js";


const CONCURRENT_CONNECTIONS = 3;
let db;
const DATABASE_URL = Deno.env.toObject().DATABASE_URL;

if(Deno.args.length == 0) {
	db = dataConfig.database
}
else {
	db= DATABASE_URL
}
const connectionPool = new Pool(db, CONCURRENT_CONNECTIONS);

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
