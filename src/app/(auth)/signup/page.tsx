"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import {z} from "zod";
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import cryLogo from "../../../../public/cypresslogo.svg"
import Loader from '@/components/global/Loader';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck } from 'lucide-react';
import { FormSchema } from '@/lib/types';
import { actionSignUpUser } from '@/lib/server-actions/auth-actions';
const SignUpFromSchema =z.object({
    email:z.string().describe("Email").email({message:"Invalid Email Id"}),
    password:z.string().describe("Password").min(6,'Password must be minimum 6 characters'),
    confirmPassword:z.string().describe("Confirm Password").min(6,'Password must be minimum 6 characters:'),
    fullName:z.string().describe("Full Name").min(6,'Full Name must be minimum 6 characters'),
}).refine((data)=>{
    data.password === data.confirmPassword,{
        message:"Password don't match",
        path:['confirmPassword']
    }
});

const SignUp = () => {
    const router = useRouter();
    const [submitError,setSubmitError] =useState('');
    const [confirmation,setConfirmation] = useState(false);
    const searchParams =useSearchParams();

    const codeExchangeError =useMemo(()=>{
        if(!searchParams) return '';
        return searchParams.get('error_description');
    },[searchParams]);

    const confirmationAndErrorStyles =useMemo(()=>{
        clsx('bg-primary',{
            'bg-red-500/10':codeExchangeError,
            'border-red-500/50':codeExchangeError,
            'text-red-700':codeExchangeError
        })
    },[codeExchangeError])

    const form =useForm<z.infer<typeof SignUpFromSchema>>({
        mode:"onChange",
        resolver:zodResolver(SignUpFromSchema),
        defaultValues:{email:'', password:'',confirmPassword:"",fullName:""}
    });
    const onSubmit =async({fullName ,email,password}:z.infer<typeof FormSchema>)=>{
        const {error} =await actionSignUpUser({email,password,fullName});
        if(error){
            setSubmitError(error.message);
            form.reset();
            return;
        }
        setConfirmation(true);
    }
    const isLoading =form.formState.isSubmitting;
  return (
    <>
      <Form {...form}>
        <form onChange={()=>{
            if(submitError) setSubmitError("");
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col'
        >
<Link href={"/"} className='w-full flex justify-left items-center'>
                <Image src={cryLogo}
                alt='cypress Logo'
                width={50}
                height={50} />
                <span className=' font-semibold dark:text-white text-4xl first-letter::ml-2'>
                    cypress
                </span>
            </Link>
            <FormDescription
            className='text-foreground/60'

            >
                An all-In-One Collaboration and Productivity Platform
            </FormDescription>
            {!confirmation && !codeExchangeError && <>
                <FormField 
            disabled={isLoading} 
            control={form.control} 
            name='fullName'
            render={({field})=>(
                <FormItem>
                        <FormControl>
                            <Input type='text' placeholder='Enter a full Name' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField 
            disabled={isLoading} 
            control={form.control} 
            name='email'
            render={({field})=>(
                <FormItem>
                        <FormControl>
                            <Input type='Email' placeholder='Enter a Email Address' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField 
            disabled={isLoading} 
            control={form.control} 
            name='password'
            render={({field})=>(
                <FormItem>
                        <FormControl>
                            <Input type='password' placeholder='Enter a Password' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField 
            disabled={isLoading} 
            control={form.control} 
            name='confirmPassword'
            render={({field})=>(
                <FormItem>
                        <FormControl>
                            <Input type='password' placeholder='Enter a Confirm Password' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type='submit' className='w-full p-6' disabled={isLoading}>{isLoading ? <Loader/> : "Create Account"}</Button>
            </>}
            
            {submitError && <FormMessage>{submitError}</FormMessage>}
            <span className=' self-container'>
                Already have an account ? {' '}<Link href={"/login"} className='text-primary'>Login</Link>
            </span>
            {(confirmation || codeExchangeError) && <>
            {/* <Alert className={confirmationAndErrorStyles}>
                {!codeExchangeError && <MailCheck className='h-4 w-4' />}
                <AlertTitle>
                    {
                        codeExchangeError ? "Invalid Link":"Check your email."
                    }
                </AlertTitle>
                <AlertDescription>
                    {codeExchangeError || 'An email confirmation has been sent'}
                </AlertDescription>
            </Alert> */}
            <MailCheck className='h-4 w-4' />
            </>}
        </form>
      </Form>
    </>
  )
}

export default SignUp;
