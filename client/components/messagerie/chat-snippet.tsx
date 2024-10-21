'use client';

import { cn, constructS3Url } from '@/lib/utils';
import { ExtendedChatResponse } from '@/types/query';
import moment from 'moment';
import 'moment/locale/fr';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
moment.locale('fr');

export default function ChatSnippet({ chat }: { chat: ExtendedChatResponse }) {
  const pathname = usePathname();

  console.log(chat);

  return (
    <Link
      key={chat.chat_id}
      href={`/messagerie/${chat.chat_id}`}
      className={cn(
        'flex w-full cursor-pointer items-center justify-between gap-4xl border-b border-input p-md duration-fast last:border-none hover:opacity-60',
        pathname === `/messagerie/${chat.chat_id}` && 'pointer-events-none opacity-60'
      )}
    >
      <div className="flex items-center gap-sm">
        <div className="relative aspect-square h-[48px] w-[48px] overflow-hidden rounded-full">
          <Image
            src={constructS3Url(chat.other_user_image ?? '/static/default-avatar.png')}
            alt={chat.other_user_name}
            fill
            sizes="48px"
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex flex-col gap-xxs">
          <p className="body">{chat.other_user_name}</p>
          <p className="body-sm -mt-xs">{chat.last_message_content ?? chat.meal_name}</p>
          <div className="relative aspect-square h-[36px] w-[36px] overflow-hidden rounded-sm">
            <Image
              src={constructS3Url(chat.meal_image)}
              alt={chat.other_user_name}
              fill
              sizes="36px"
              className="rounded-sm object-cover"
            />
          </div>
        </div>
      </div>
      <p className="body-sm text-grayed">{moment(chat.update_time).fromNow()}</p>
    </Link>
  );
}
