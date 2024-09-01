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

function UsageTrack() {

    const {user} = useUser();
    const {totalUsage, setTotalUsage} = useContext(TotalUsageContext);
    
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
    }, [user]);

    const getTotalUsage = (result:HISTORY[])=>{
      let total:number = 0;
      result.forEach(element=>{total=total+Number(element.aiResponse?.length)});
      setTotalUsage(total);
      console.log("tt: ", total);
    }

  return (
    <div className='m-5'>
        <div className='bg-primary text-white p-3 rounded-lg'> 
            <h2 className='font-medium'>Credits</h2>
            <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
                <div className='h-2 bg-white rounded-full' 
                style={{
                  width:(totalUsage/10000)*100+"%"
                }}
                ></div>
            </div>
            <h2 className='my-2'>{totalUsage}/10,000 credits used</h2>
        </div>
        <Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button>
    </div>
  )
}

export default UsageTrack