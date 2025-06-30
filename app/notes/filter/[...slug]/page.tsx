//Notes/filter/[...slug]/page.tsx

import NotesClient from "./Notes.client";
import styles from "./NotesPage.module.css";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";

interface NotesPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params; //
  const tag = slug?.[0] === "All" ? undefined : slug?.[0]; // якщо tag="All" робимо замість нього undefined
  const initialData: FetchNotesResponse = await fetchNotes({
    page: 1,
    query: "",
    perPage: 12,
    tag, // якщо undefined - пропускаємо параметр
  });

  return (
    <div className={styles.notesPageWrapper}>
      <div className={styles.pageContainer}>
        <NotesClient initialData={initialData} tag={slug?.[0]} />
      </div>
    </div>
  );
}
