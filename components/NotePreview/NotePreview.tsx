// NotePreview.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";
import type { Note } from "@/types/note";

interface NotePreviewProps {
  id: number;
  onClose: () => void;
}

export default function NotePreview({ id, onClose }: NotePreviewProps) {
  const { data: note } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    initialData: () => {
      const queryClient = new QueryClient();
      return dehydrate(queryClient).queries.find(
        (q) => q.queryKey[0] === "note" && q.queryKey[1] === id,
      )?.state.data;
    },
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  if (!note) {
    return null;
  }

  const displayDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString()
    : "Date unavailable";

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button className={css.backBtn} onClick={onClose}>
            Back
          </button>
        </div>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <p className={css.date}>{displayDate}</p>
          <span className={css.tag}>{note.tag}</span>
        </div>
      </div>
    </div>
  );
}
