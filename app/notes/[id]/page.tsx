// app/notes/[id]/page.tsx

import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import NotesClient from "../filter/[...slug]/Notes.client";
import styles from "../filter/[...slug]/NotesPage.module.css";
import { use } from "react";

export default function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const noteId = parseInt(resolvedParams.id, 10);

  if (isNaN(noteId)) {
    return <p>Invalid note ID</p>;
  }

  // Передзагрузка фонового списку нотаток (наприклад, All notes, page 1)
  const defaultTag = undefined;
  const defaultPage = 1;
  const initialDataForBackground: FetchNotesResponse = await fetchNotes({
    page: defaultPage,
    query: "",
    perPage: 12,
    tag: defaultTag,
  });

  return (
    <div className={styles.notesPageWrapper}>
      <div className={styles.pageContainer}>
        <NotesClient
          initialData={initialDataForBackground}
          tag={defaultTag}
          page={defaultPage}
        />
      </div>
    </div>
  );
}
