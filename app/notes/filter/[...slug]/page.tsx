//Notes/filter/[...slug]/page.tsx

import NotesClient from "./Notes.client";
import styles from "./NotesPage.module.css";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";

interface NotesPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] === "none" ? undefined : slug?.[0];
  const pageNumber = 1; // Default page for initial render

  const initialData: FetchNotesResponse = await fetchNotes({
    page: pageNumber,
    query: "",
    perPage: 12,
    tag,
  });

  return (
    <div className={styles.notesPageWrapper}>
      <div className={styles.pageContainer}>
        <NotesClient
          initialData={initialData}
          tag={tag}
          noteId={undefined}
          page={pageNumber}
          isDirectAccess={false}
        />
      </div>
    </div>
  );
}
