// app/notes/[id]/page.tsx

import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import NotesClient from "../filter/[...slug]/Notes.client";
import styles from "../filter/[...slug]/NotesPage.module.css";

export default async function NoteDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const noteId = parseInt(params.id, 10);

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

  return (
    <div className={styles.notesPageWrapper}>
      <div className={styles.pageContainer}>
        <NotesClient
          initialData={initialData}
          tag={defaultTag}
          page={defaultPage}
        />
      </div>
    </div>
  );
}
