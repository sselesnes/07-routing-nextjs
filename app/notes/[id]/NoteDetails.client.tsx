//app/notes/[id]/NoteDetails.client.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NoteDetails.module.css";
import type { Note } from "@/types/note";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "@/lib/api";
import type { PaginatedNotes } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NoteDetailsClient({ id }: { id: number }) {
  const router = useRouter();
  const { data: note } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [mutationError, setMutationError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLSelectElement>(null);

  const mutation = useMutation({
    mutationFn: (data: {
      id: number;
      title: string;
      content: string;
      tag: string;
    }) => updateNote(data),
    onSuccess: (updatedNote) => {
      queryClient.setQueryData(["note", id], updatedNote);
      queryClient.setQueriesData<PaginatedNotes>(
        { queryKey: ["notes"] },
        (oldData) => {
          if (oldData && oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                notes: page.notes.map((n: Note) =>
                  n.id === id ? { ...n, ...updatedNote } : n,
                ),
              })),
            };
          }
          return oldData;
        },
      );
      // Додаємо інвалідацію кешу для перезапиту
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsEditing(false);
      setMutationError(null);
      handleClose();
    },
    onError: (error: Error) => {
      setMutationError(error);
    },
  });

  if (mutationError) {
    throw mutationError;
  }

  if (!note) {
    return null;
  }

  const displayDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString()
    : "Date unavailable";

  const handleEditClick = () => {
    setIsEditing(true);
    setMutationError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (note && titleRef.current && contentRef.current && tagRef.current) {
      const updatedNote = {
        id: note.id,
        title: titleRef.current.value,
        content: contentRef.current.value,
        tag: tagRef.current.value,
      };
      mutation.mutate(updatedNote);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMutationError(null);
    handleClose();
  };

  const handleClose = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/notes/filter/All");
    }
  };

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button className={css.closeBtn} onClick={handleClose}>
            Close details
          </button>
        </div>
        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                ref={titleRef}
                defaultValue={note.title}
                className={css.input}
              />
            </div>
            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                ref={contentRef}
                defaultValue={note.content}
                className={css.textarea}
              />
            </div>
            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <select
                id="tag"
                ref={tagRef}
                defaultValue={note.tag}
                className={css.select}
              >
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelBtn}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.saveBtn}
                disabled={mutation.isPending}
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <p className={css.date}>{displayDate}</p>
              {!isEditing && (
                <>
                  <button className={css.editBtn} onClick={handleEditClick}>
                    Edit note
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
