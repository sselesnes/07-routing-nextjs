// NotePreview.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";
import type { Note } from "@/types/note";
import { useRouter } from "next/navigation";

interface NotePreviewProps {
  id: number;
  onClose: () => void;
  tag?: string; // Current filter tag
  page?: number; // Current page number
}

export default function NotePreview({
  id,
  onClose,
  tag,
  page = 1,
}: NotePreviewProps) {
  const router = useRouter();
  const { data: note } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (!note) {
    return null;
  }

  const displayDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString()
    : "Date unavailable";

  const handleClose = () => {
    // Placeholder for future Edit Note functionality
    const isNoteEdited = false; // Replace with actual edit check when implemented
    if (isNoteEdited && tag) {
      const targetRoute =
        tag !== "none"
          ? `/notes/filter/${tag}?page=${page}`
          : `/notes/filter/none?page=${page}`;
      router.replace(targetRoute); // Re-render the filter page if note was edited
    } else {
      router.back(); // Navigate back in history
    }
    onClose(); // Close the modal
  };

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button className={css.backBtn} onClick={handleClose}>
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
