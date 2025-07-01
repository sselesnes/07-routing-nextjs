//notes/[id]/page.tsx

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NotePreviewModal from "./NotePreviewModal.client";
import { QueryClient } from "@tanstack/react-query";

export default async function NoteDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { id } = await params;
  const { tag, page } = await searchParams;

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return <p>Invalid note ID</p>;
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", numericId],
    queryFn: () => fetchNoteById(numericId),
  });

  const note = await fetchNoteById(numericId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewModal
        id={numericId}
        tag={tag || note?.tag || undefined}
        page={page ? parseInt(page, 10) : 1}
      />
    </HydrationBoundary>
  );
}
