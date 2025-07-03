// app/notes/[id]/page.tsx

import { fetchNoteById, fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import NotesClient from "../filter/[...slug]/Notes.client"; // Ваш основний клієнтський компонент списку
import NotePreviewModal from "@/components/NotePreview/NotePreviewModal.client"; // Новий шлях імпорту для модалки
import styles from "../filter/[...slug]/NotesPage.module.css"; // Можливо, варто розглянути переміщення цього CSS до глобального або до кореня NotesClient

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

  // Prefetch data for the background NotesClient (default to All notes, page 1)
  const defaultTag = undefined; // Відповідає 'All' в URL
  const defaultPage = 1;

  const initialDataForBackground: FetchNotesResponse = await fetchNotes({
    page: defaultPage,
    query: "",
    perPage: 12,
    tag: defaultTag,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={styles.notesPageWrapper}>
        <div className={styles.pageContainer}>
          {/* Рендеримо фоновий список нотаток */}
          <NotesClient
            initialData={initialDataForBackground}
            tag={defaultTag}
            page={defaultPage}
          />
          {/* Рендеримо модальне вікно поверх фону */}
          {/* Не передаємо onClose з Server Component */}
          <NotePreviewModal id={noteId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
