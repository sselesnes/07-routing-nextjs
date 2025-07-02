//notes/filter/[...slug]/Notes.client.tsx

"use client";

import css from "./NotesPage.module.css";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NotePreviewModal from "../../[id]/NotePreviewModal.client";

interface NotesClientProps {
  initialData: FetchNotesResponse;
  tag?: string;
  noteId?: number;
  page?: number;
  isDirectAccess?: boolean;
}

export default function NotesClient({
  initialData,
  tag,
  noteId,
  page = 1,
  isDirectAccess = false,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(page);
  const [currentTag, setCurrentTag] = useState(tag);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(
    noteId || null,
  );
  const router = useRouter();

  const apiTag = currentTag;

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
  });

  if (error) {
    throw error;
  }

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    setSearchQuery(value);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleViewDetails = (id: number, tag?: string, page?: number) => {
    setSelectedNoteId(id);
    setCurrentTag(tag);
    setCurrentPage(page || 1);
    router.push(`/notes/${id}`);
  };

  const handleCloseNotePreview = () => {
    setSelectedNoteId(null);
    if (isDirectAccess) {
      router.replace("/notes/filter/none"); // Navigate to /notes/filter/none for direct access
    } else {
      router.replace(`/notes/filter/${currentTag || "none"}`); // Navigate back to /notes/filter/[tag]
    }
  };

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
          tag={currentTag}
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
        <NotePreviewModal
          id={selectedNoteId}
          tag={currentTag}
          page={currentPage}
          onClose={handleCloseNotePreview}
        />
      )}
    </div>
  );
}
