//Notes/filter/[...slug]/page.tsx

import NotesClient from "./Notes.client";
import styles from "./NotesPage.module.css";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";

interface NotesPageProps {
  params: { slug?: string[] };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] === "none" ? undefined : slug?.[0];
  const initialData: FetchNotesResponse = await fetchNotes({
    page: 1,
    query: "",
    perPage: 12,
    tag,
  });

  return (
    <div className={styles.notesPageWrapper}>
      <div className={styles.pageContainer}>
        <NotesClient initialData={initialData} tag={slug?.[0]} />
      </div>
    </div>
  );
}
