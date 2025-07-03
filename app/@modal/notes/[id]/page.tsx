// app/@modal/notes/[id]/page.tsx

import { fetchNoteById } from "@/lib/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import NotePreviewModal from "@/components/NotePreview/NotePreviewModal.client"; // Новий шлях імпорту

interface NoteDetailsPageProps {
  params: { id: string }; // Очікуємо, що params вже розв'язаний об'єкт
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const queryClient = new QueryClient();
  const noteId = parseInt(params.id, 10); // Використовуємо params.id без await

  if (isNaN(noteId)) {
    return <p>Invalid note ID</p>;
  }

  // Prefetch data for the specific note (for the modal)
  await queryClient.prefetchQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Не передаємо onClose з Server Component */}
      <NotePreviewModal id={noteId} />
    </HydrationBoundary>
  );
}
