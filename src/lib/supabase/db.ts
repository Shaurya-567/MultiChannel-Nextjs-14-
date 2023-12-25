import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from '../../../migrations/schema';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
dotenv.config({path:'.env'});
// console.log("👺",process.env)
if(!process.env.DATABASE_URL){
    console.log("🛑 Can't find the database url");

}

const client = postgres(process.env.DATABASE_URL as string,{max:1});
const db =drizzle(client,{schema});
const migratedDb =async()=>{
    try{
        console.log("🟠Migrating Client");
        await migrate(db,{migrationsFolder:"migrations"});
        console.log("🟢 Successfully Migrated");
    }
    catch(err){
        console.log(err);
        console.log("🔴 Failed to migrate");
    }


}
migratedDb();
export default db;