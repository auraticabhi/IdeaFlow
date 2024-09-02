import { db } from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';
import HistoryClient from './components/HistoryClient'; // Import the client component

export interface HISTORY {
    id: Number,
    formData: string,
    aiResponse: string,
    templateSlug: string,
    createdBy: string,
    createdAt: string
}

async function History() {
    const user = await currentUser();
    {/* @ts-ignore */}
    const HistoryList: HISTORY[] = await db.select().from(AIOutput).where(eq(AIOutput?.createdBy, user?.primaryEmailAddress?.emailAddress)).orderBy(desc(AIOutput.id));

    return <HistoryClient HistoryList={HistoryList} />;
}

export default History;
