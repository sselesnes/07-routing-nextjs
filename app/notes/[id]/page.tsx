// app/notes/[id]/page.tsx

import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import NotesClient from "../filter/[...slug]/Notes.client";
import css from "../filter/[...slug]/NotesPage.module.css";

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const noteId = parseInt(resolvedParams.id, 10);

  if (isNaN(noteId)) {
    return <p>Invalid note ID</p>;
  }

  // Передзагрузка фонового списку нотаток (наприклад, All notes, page 1)
  const defaultTag = undefined;
  const defaultPage = 1;
  const initialData: FetchNotesResponse = await fetchNotes({
    page: defaultPage,
    query: "",
    perPage: 12,
    tag: defaultTag,
  });

  // Перевірка, чи це прямий вхід (без попереднього контексту)
  const isDirectEntry = !process.env.NEXT_PUBLIC_IS_PRELOADED;

  return (
    <div className={css.notesPageWrapper}>
      <div className={css.pageContainer}>
        <NotesClient
          initialData={initialData}
          tag={defaultTag}
          page={defaultPage}
          isModalOpen={isDirectEntry ? true : undefined}
        />
      </div>
    </div>
  );
}
