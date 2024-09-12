'use client';

import { constructS3Url } from '@/lib/utils';
import { UserResponse } from '@/types/query';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../dropdown-menu';

export default function UserMenu({ user }: { user: UserResponse }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <div className="flex items-center gap-xs">
          <div className="relative h-button w-button overflow-hidden rounded-full">
            <Image
              fill
              src={constructS3Url(user.picture_key ?? 'static/default-avatar.png')}
              alt="user.name"
              sizes={'64px'}
              className="rounded-full object-cover object-center"
            />
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit rounded-xs [&>a]:cursor-pointer">
        <DropdownMenuItem asChild>
          <Link href={`/utilisateur/${user.username}`}>Mon profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/parametres/profil`}>Mes paramètres</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/repas`}>Mes repas</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/commandes`}>Mes commandes</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:!bg-error-50">
          <a href={`api/auth/logout`} className={'text-error hover:!bg-none'}>
            Se déconnecter
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
