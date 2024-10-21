import SearchBar from '@/components/home/search-bar';
import Chat from '@/components/messagerie/chat';
import { getChatSnippet } from '@/lib/chat/chat-fetch';
import { getErrorMessage } from '@/lib/utils';
import { ChatSnippetResponse } from '@/types/query';
import { getSession } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';

import { Logger } from 'next-axiom';
import { redirect } from 'next/navigation';

type Props = {
  params: { id: string };
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata | undefined> {
  const log = new Logger();
  const session = await getSession();

  if (!session?.user.sub || !session.accessToken) {
    redirect('/');
  }

  let chatSnippet: ChatSnippetResponse;
  try {
    chatSnippet = await getChatSnippet(params.id, {
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
    return undefined;
  }

  if (!chatSnippet || chatSnippet instanceof Error) {
    log.error(`Error fetching chat snippet: ${getErrorMessage(chatSnippet)}`);
    await log.flush();
    return undefined;
  }

  return {
    title: `${chatSnippet.meal_name} | ${chatSnippet.other_user_name}`,
    robots: 'noindex, nofollow'
  } satisfies Metadata;
}

export default async function Home({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session?.user.sub || !session.accessToken) {
    redirect('/');
  }

  return (
    <>
      <SearchBar className="section-px w-full tablet:hidden laptop:px-0" />
      <Chat id={params.id} token={session.accessToken} />
    </>
  );
}
