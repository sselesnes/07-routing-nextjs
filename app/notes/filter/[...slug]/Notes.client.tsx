// notes/filter/[...slug]/Notes.client.tsx

"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useRouter, usePathname } from "next/navigation";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NotePreviewClient from "@/components/NotePreview/NotePreview.client";

import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";

import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialData: FetchNotesResponse;
  tag?: string;
  page?: number;
  isModalOpen?: boolean;
}

export default function NotesClient({
  initialData,
  tag,
  page = 1,
  isModalOpen,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null); // Ініціалізація без хуків

  const router = useRouter();
  const pathname = usePathname(); // Виклик хука на верхньому рівні

  const apiTag = tag;

  const { data, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: [
      "notes",
      { page: currentPage, query: debouncedQuery, tag: apiTag },
    ],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        query: debouncedQuery,
        perPage: 12,
        tag: apiTag,
      }),
    placeholderData: keepPreviousData,
    initialData:
      currentPage === 1 && debouncedQuery === "" && apiTag === initialData.tag
        ? initialData
        : undefined,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    throw error;
  }

  const generateUrlPath = useCallback(
    (tag: string | undefined, page: number): string => {
      const tagSegment = tag || "All";
      if (page === 1) {
        return `/notes/filter/${tagSegment}`;
      }
      return `/notes/filter/${tagSegment}/${page}`;
    },
    [],
  );

  useEffect(() => {
    const newPath = generateUrlPath(tag, currentPage);
    if (
      pathname !== newPath &&
      !pathname.startsWith("/notes/") &&
      pathname !== "/"
    ) {
      router.push(newPath);
    }
    // Оновлення selectedNoteId на основі pathname і isModalOpen
    if (isModalOpen) {
      const idFromPath = parseInt(pathname.split("/").pop() || "0", 10);
      if (!isNaN(idFromPath)) {
        setSelectedNoteId(idFromPath);
      }
    }
  }, [tag, currentPage, pathname, router, generateUrlPath, isModalOpen]);

  const handlePageChange = useCallback((selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setCurrentPage(1);
    setSearchQuery(value);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleViewDetails = useCallback(
    (id: number) => {
      setSelectedNoteId(id);
      router.push(`/notes/${id}`, { scroll: false });
    },
    [router],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedNoteId(null);
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/notes/filter/All");
    }
  }, [router]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
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

      {data?.notes && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          tag={tag}
          page={currentPage}
          onViewDetails={handleViewDetails}
        />
      )}
      {data?.notes && data.notes.length === 0 && <p>Nothing found</p>}

      {isCreateModalOpen && (
        <Modal onClose={handleCloseCreateModal}>
          <NoteForm onClose={handleCloseCreateModal} />
        </Modal>
      )}

      {selectedNoteId && (
        <Modal onClose={handleCloseModal}>
          <NotePreviewClient id={selectedNoteId} />
        </Modal>
      )}
    </div>
  );
}
