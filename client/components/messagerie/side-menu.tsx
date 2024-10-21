import { getUserChats } from '@/lib/chat/chat-fetch';
import { getErrorMessage } from '@/lib/utils';
import { ExtendedChatResponse } from '@/types/query';
import { Session } from '@auth0/nextjs-auth0';

import { Logger } from 'next-axiom';
import ChatSnippet from './chat-snippet';

export default async function SideMenu({ session }: { session: Session }) {
  const log = new Logger();

  let chats: ExtendedChatResponse[] = [];
  try {
    chats = await getUserChats(session.user.sub as string, {
      next: { tags: [`user-${session.user.sub}-chats`], revalidate: 60 },
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
  } catch (error) {
    const message = getErrorMessage(error);
    if (!message.includes('404')) {
      log.error(`Orders not found: ${message}`);
      await log.flush();
    }
    log.error('Error fetching chats', { error });
    await log.flush();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-md max-laptop-sm:px-sm laptop-sm:w-fit">
      <h1 className="heading-h1 whitespace-nowrap font-medium">Mes messages</h1>
      <nav className="card flex p-0 laptop-sm:flex-col">
        {chats.map((chat) => (
          <ChatSnippet key={chat.chat_id} chat={chat} />
        ))}
      </nav>
    </aside>
  );
}
