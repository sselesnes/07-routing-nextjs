//notes\[id]\page.tsx

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { QueryClient } from "@tanstack/react-query";

export default async function NoteDetails({
  params,
}: {
  // params should be awaited before using its properties
  params: Promise<{ id: string }>;
}) {
  const queryClient = new QueryClient();

  // Очікуємо на resolve об’єкта params
  const resolvedParams = await params;

  // Перевірка та валідація id перед асинхронними операціями
  if (!resolvedParams?.id) {
    return <p>Invalid note ID</p>;
  }

  const idString = resolvedParams.id;
  const id = parseInt(idString, 10);

  if (isNaN(id)) {
    return <p>Invalid note ID</p>;
  }

  // Завантаження нотатки
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
