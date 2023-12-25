import {z} from 'zod';
export const FormSchema =z.object({
    email:z.string().describe('Email').email({message:"Invalid Email"}),
    password:z.string().describe('Password').min(6,'Password is required'),
    fullName:z.string().describe('Full Name').min(5,'Full Name is required'),
})