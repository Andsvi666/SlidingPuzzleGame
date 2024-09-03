'use server'

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Function return all data from selected table
export async function getTableData(table, includedTables) 
{
    try 
    {  
        const data = await prisma[table].findMany({
            include: includedTables
          });
        return data;    
    } 
    catch (error) 
    {
        console.error(`Error fetching data from ${table}:`, error);
        throw error;
    }
}

//Function deletes entrty of given id from given table
export async function deleteEntry(table, id) 
{
    try 
    {  
        await prisma[table].delete({
            where: {id: id}
        })  
    } 
    catch (error) 
    {
        console.error(`Error deleting entry ${id} from ${table}:`, error);
        throw error;
    }
}

//Function edits entry of given id from given table with given data
export async function editEntry(table, id, newEntry) 
{
    try 
    {  
        await prisma[table].update({
            where: {id: id},
            data: newEntry
        })
    } 
    catch (error) 
    {
        console.error(`Error editing entry ${id} from ${table}:`, error);
        throw error;
    }
}

//Function inserts new entry of to given table
export async function insertEntry(table, newEntry) 
{
    try 
    {  
        await prisma[table].create({
            data: newEntry
        })
    } 
    catch (error) 
    {
        console.error(`Error inserting new entry to table ${table}:`, error);
        throw error;
    }
}

//Function return all data from selected table
export async function selectEntry(table, id) 
{
    try 
    {  
        const data = await prisma[table].findUnique({
            where: {
                id: id,
            }
        })
        return data;    
    } 
    catch (error) 
    {
        console.error(`Error fetching data from ${table}:`, error);
        throw error;
    }
}

const bcrypt = require('bcrypt');

//Function that hashes and returns password
export async function hashPassword(password) 
{
    try 
    {  
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } 
    catch (error) 
    {
        console.error(`Error hashing password ${password}:`, error);
        throw error;
    }
}


//Function that checks typed password with hased password
export async function checkPassword(password, hashedPassword) 
{
    try 
    {  
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        return isPasswordValid;
    } 
    catch (error) 
    {
        console.error(`Error comparing password: `, error);
        throw error;
    }
}

