import { getLastChatId } from '@/lib/chat/chat-fetch';
import { getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { Logger } from 'next-axiom';
import { redirect } from 'next/navigation';

export default async function Page({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session?.user.sub || !session.accessToken) {
    redirect('/');
  }

  const log = new Logger();

  let lastChatId: string | undefined;
  try {
    const id = await getLastChatId(session.user.sub as string, {
      next: { tags: [`user-${session.user.sub}-chats`], revalidate: 60 },
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    lastChatId = id;
  } catch (error) {
    const message = getErrorMessage(error);
    if (!message.includes('404')) {
      log.error(`No chats found: ${message}`);
      await log.flush();
    }
    log.error('Error fetching chats', { error });
    await log.flush();
  }

  return redirect(`/messagerie/${lastChatId}`);
}
