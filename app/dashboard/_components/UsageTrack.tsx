"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server'
import React, { useContext, useEffect, useState } from 'react'
import { HISTORY } from '../history/page';
import { eq } from 'drizzle-orm';
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext';
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext';

function UsageTrack() {

    const {user} = useUser();
    const {totalUsage, setTotalUsage} = useContext(TotalUsageContext);
    const {userSubscription, setUserSubscription} = useContext(UserSubscriptionContext);
    const [maxWords, setMaxWords] = useState(10000);
    const GetData = async () => {
      try {
        {/* @ts-ignore */}
        const result: HISTORY[] = await db.select().from(AIOutput).where(eq(AIOutput.createdBy, user?.primaryEmailAddress?.emailAddress));
        //console.log("Result: ", result);
        getTotalUsage(result);
        
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    useEffect(()=>{
      user&&GetData();
      user&&IsUserSubscribe();
    }, [user]);

    const getTotalUsage = (result:HISTORY[])=>{
      let total:number = 0;
      result.forEach(element=>{total=total+Number(element.aiResponse?.length)});
      setTotalUsage(total);
      console.log("tt: ", total);
    }

    const IsUserSubscribe = async () => {
      try {
        // Make sure user is defined
        if (!user || !user.primaryEmailAddress?.emailAddress) {
          console.error("User email is not defined");
          return;
        }
    
        // Execute the query
        const result = await db
          .select()
          .from(userSubscription)
          .where(eq(userSubscription.email, user.primaryEmailAddress.emailAddress));
    
        // Check if the result is not empty
        if (result && result.length > 0) {
          setUserSubscription(true);
          setMaxWords(1000000);
        } else {
          console.log("No subscription found for this user");
        }
      } catch (error) {
        console.error("Error executing query:", error);
      }
    };

  return (
    <div className='m-5'>
        <div className='bg-primary text-white p-3 rounded-lg'> 
            <h2 className='font-medium'>Credits</h2>
            <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
                <div className='h-2 bg-white rounded-full' 
                style={{
                  width:(totalUsage/maxWords)*100+"%"
                }}
                ></div>
            </div>
            <h2 className='my-2'>{totalUsage}/{maxWords} credits used</h2>
        </div>
        <Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button>
    </div>
  )
}

export default UsageTrack