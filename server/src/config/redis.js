import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if(!url || !token){
    console.warn("⚠️ Missing Upstash credentials in server/.env. Redis caching disabled.");
}

export const redis = url && token ? new Redis({ url , token }) : null;

/**
 * Retrieve cached data from Upstash Redis
 * @param {string} key
 */
export const getCache = async (key) => {
    if(!redis)  return null;
    try{
        const data = await redis.get(key);
        return data;
    }
    catch(error){
        console.error(`Upstash GET error for key "${key}":`, error.message);
        return null;
    }
};

/**
 * Save data to Upstash Redis with a TTL in seconds
 * @param {string} key
 * @param {any} value
 * @param {number} ttlInSeconds - Default 300s (5 minutes)
 */
export const setCache = async (key, value, ttlInSeconds = 300) => {
    if(!redis)  return;
    try{
        await redis.set(key, value, { ex: ttlInSeconds });
    }
    catch(error){
        console.error(`Upstash SET error for key "${key}":`, error.message);
    }  
};

/**
 * Invalidate keys matching a pattern (e.g. "owner:properties:<userId>*")
 * @param {string} pattern
 */
export const invalidateCachePattern = async (pattern) => {
    if(!redis) return;
    try{
        let cursor = 0;
        do{
            const [nextCursor, keys] = await redis.scan(cursor, { match: pattern, count: 50 });
            cursor = Number(nextCursor);
            if(keys && keys.length > 0){
                await redis.del(...keys);
            }
        }
        while(cursor !== 0);
    }
    catch(error){
        console.error(`Upstash Invalidation error for pattern "${pattern}":`, error.message);
    }
};