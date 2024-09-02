"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react';
import { UserSubscription } from '@/utils/schema';
import moment from 'moment';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';

function billing() {

    const [loading, setLoading]=useState(false);
    const {user} = useUser();
    const createSubscription=()=>{
        setLoading(true);
        axios.post('/api/create-subscription', {}).then(res=>{
            console.log("res: ", res);
            onPayment(res.data.id);
        }, (error)=>{
            setLoading(false);
        })
    }

    const onPayment=(subId:string)=>{
        const options={
            key: "rzp_test_JXjf4BhyJImTqw",
            subscription_id: subId,
            name:'IdeaFlow',
            description:"Monthly Subscription",
            handler:async(resp:any)=>{
                //console.log(resp);
                if(resp){
                    saveSubscription(resp?.razorpay_payment_id)
                }
                setLoading(false);
            }
        }

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    const saveSubscription = async(paymentId:string)=>{
        const result = await db.insert(UserSubscription).values({
            email:user?.primaryEmailAddress?.emailAddress,
            userName:user?.fullName,
            active:true,
            paymentId:paymentId,
            joinDate:moment().format('DD/MM/yyyy')
        });
        console.log(result);
        if(result){
            window.location.reload();
        }
    }

  return (
    <div>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16'>Hey!</div>
        <h2 onClick={()=>createSubscription()} className='text-center font-bold text-3xl my-3'>Upgrade with Premium!</h2>

        <div>{loading&&<Loader2Icon className='animate-spin' />}</div>
    </div>
  )
}

export default billing