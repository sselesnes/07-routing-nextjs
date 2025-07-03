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

  const tag =
    currentSlug[0] === "All"
      ? undefined
      : (currentSlug[0] as string | undefined);
  const pageNumber = currentSlug[1] ? parseInt(currentSlug[1], 10) : 1;

  const initialData: FetchNotesResponse = await fetchNotes({
    page: pageNumber,
    query: "",
    perPage: 12,
    tag,
  });

  return <NotesClient initialData={initialData} tag={tag} page={pageNumber} />;
}
