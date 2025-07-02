// notes/[id]/page.tsx

import { fetchNoteById, fetchNotes } from "@/lib/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import NotesClient from "../filter/[...slug]/Notes.client";
import styles from "../filter/[...slug]/NotesPage.module.css";
import type { FetchNotesResponse } from "@/lib/api";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
  tag?: string;
  page?: number;
}

export default async function NoteDetails({
  params,
  tag,
  page,
}: NoteDetailsProps) {
  const queryClient = new QueryClient();
  const { id } = await params;

  const noteId = parseInt(id, 10);
  if (isNaN(noteId)) {
    return <p>Invalid note ID</p>;
  }

  // Prefetch note data
  await queryClient.prefetchQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  // Use tag and page from props, default to undefined and 1 for direct access
  const apiTag = tag === "none" ? undefined : tag;
  const pageNumber = page && !isNaN(page) ? page : 1;
  const isDirectAccess = !tag && !page; // Direct access if tag and page are not provided

  // Fetch notes for NoteList
  const initialData: FetchNotesResponse = await fetchNotes({
    page: pageNumber,
    query: "",
    perPage: 12,
    tag: apiTag,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={styles.notesPageWrapper}>
        <div className={styles.pageContainer}>
          <NotesClient
            initialData={initialData}
            tag={apiTag}
            noteId={noteId}
            page={pageNumber}
            isDirectAccess={isDirectAccess}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
}
