// NoteList.tsx
"use client";

import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import { useRouter } from "next/navigation"; // Removed usePathname as it's not directly needed here for navigation

interface NoteListProps {
  notes: Note[];
  tag?: string;
  page: number;
  onViewDetails: (id: number, tag?: string, page?: number) => void;
}

export default function NoteList({
  notes,
  // Removed unused props to simplify
  // tag,
  // page,
  // onViewDetails, // Removed this prop as it's no longer necessary with direct router push
}: NoteListProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleViewDetails = (id: number) => {
    // Navigate using the intercepting route convention
    // This tells Next.js to intercept the navigation to /notes/[id]
    // when coming from the /notes/filter/[...slug] route,
    // and render it in the @modal slot.
    router.push(`/notes/${id}`, { scroll: false }); // Use scroll: false to prevent scrolling when modal opens
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.detailsBtn}
              onClick={() => handleViewDetails(note.id)}
            >
              View details
            </button>
            <button
              className={css.deleteBtn}
              onClick={() => handleDelete(note.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
