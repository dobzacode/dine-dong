'use client';

import { useRouter } from 'next/navigation';

export default function TopMenu({
  status
}: {
  status: 'FINALIZED' | 'IN_PROGRESS' | 'CANCELLED' | undefined;
}) {
  const router = useRouter();

  const handleStatusChange = (newStatus: 'FINALIZED' | 'IN_PROGRESS' | 'CANCELLED' | null) => {
    const currentUrl = new URL(window.location.href);
    const newSearchParams = new URLSearchParams(currentUrl.search);
    if (newStatus === null) {
      newSearchParams.delete('status');
    } else {
      newSearchParams.set('status', newStatus);
    }

    currentUrl.search = newSearchParams.toString();
    router.push(currentUrl.toString());
  };

  return (
    <div className="box-content flex w-full justify-start border-b-2 border-primary-100/[.400] pb-0 [&>button]:-mb-[2px]">
      <button
        onClick={() => handleStatusChange(null)}
        data-state={status === undefined ? 'active' : ''}
        className="body inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-primary border-opacity-0 px-3 py-1.5 ring-offset-background transition-all hover:bg-primary-100/[.400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-opacity-100"
      >
        Toutes
      </button>
      <button
        onClick={() => handleStatusChange('IN_PROGRESS')}
        data-state={status === 'IN_PROGRESS' ? 'active' : ''}
        className="body inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-primary border-opacity-0 px-3 py-1.5 ring-offset-background transition-all hover:bg-primary-100/[.400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-opacity-100"
      >
        En cours
      </button>
      <button
        onClick={() => handleStatusChange('FINALIZED')}
        data-state={status === 'FINALIZED' ? 'active' : ''}
        className="body inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-primary border-opacity-0 px-3 py-1.5 ring-offset-background transition-all hover:bg-primary-100/[.400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-opacity-100"
      >
        Terminées
      </button>
      <button
        onClick={() => handleStatusChange('CANCELLED')}
        data-state={status === 'CANCELLED' ? 'active' : ''}
        className="body inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-primary border-opacity-0 px-3 py-1.5 ring-offset-background transition-all hover:bg-primary-100/[.400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-opacity-100"
      >
        Annulées
      </button>
    </div>
  );
}
