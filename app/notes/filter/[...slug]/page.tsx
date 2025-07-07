// Notes/filter/[...slug]/page.tsx

import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const currentSlug = slug || [];
  let tag =
    currentSlug[0] === "All"
      ? undefined
      : (currentSlug[0] as string | undefined);
  const pageNumber = 1;
  const searchQuery = currentSlug[1];
  if (!searchQuery) {
    tag = "none";
  }

  const initialData: FetchNotesResponse = await fetchNotes({
    page: pageNumber,
    query: searchQuery,
    perPage: 12,
    tag,
  });

  return (
    <NotesClient
      initialData={initialData}
      tag={tag}
      page={pageNumber}
      searchQuery={searchQuery}
    />
  );
}
