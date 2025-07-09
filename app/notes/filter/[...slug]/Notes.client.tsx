// app/notes/filter/[...slug]/Notes.client.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { usePathname } from "next/navigation";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NotePreviewClient from "@/app/notes/[id]/NoteDetails.client";

import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import type { Tags } from "@/types/note";

import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialData: FetchNotesResponse;
  tag: Tags | undefined;
}

export default function NotesClient({ initialData, tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(initialData.page || 1);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(localSearchQuery, 500);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [currentTag, setCurrentTag] = useState<string | undefined>(tag);

  const pathname = usePathname();
  const apiTag = currentTag;

  const { data, error, isLoading } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedQuery, apiTag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        query: debouncedQuery,
        perPage: 12,
        tag: apiTag,
      }),
    placeholderData: keepPreviousData,
    initialData: initialData, // Передача початкових даних з пропсів
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    throw error;
  }

  useEffect(() => {
    const idFromPath = parseInt(pathname.split("/").pop() || "0", 10);

    if (
      !isNaN(idFromPath) &&
      pathname.startsWith("/notes/") &&
      !pathname.includes("/@modal/")
    ) {
      setSelectedNoteId(idFromPath); // Встановлюємо лише для /notes/[id], виключаючи /@modal
    } else if (pathname.startsWith("/notes/filter/")) {
      setSelectedNoteId(null); // Скидаємо для /notes/filter/[slug]
    }
  }, [pathname]);

  const handlePageChange = useCallback((selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setCurrentPage(1);
      setLocalSearchQuery(value);
      if (value && !debouncedQuery) {
        setCurrentTag(undefined); // Скидання тега на "All" при початку пошуку
      } else if (!value && debouncedQuery) {
        setCurrentTag(tag); // Повернення до початкового тегу при очищенні
      }
    },
    [debouncedQuery, tag],
  );

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={localSearchQuery} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage - 1}
          />
        )}
        <button
          className={css.button}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create note +
        </button>
      </header>
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>Nothing found</p>
      )}
      {isCreateModalOpen && !selectedNoteId && (
        <Modal onClose={handleCloseCreateModal}>
          <NoteForm onClose={handleCloseCreateModal} />
        </Modal>
      )}
      {selectedNoteId &&
        !isCreateModalOpen &&
        !pathname.includes("/@modal/") && (
          <NotePreviewClient id={selectedNoteId} />
        )}
    </div>
  );
}
