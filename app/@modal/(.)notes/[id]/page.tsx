// app/@modal/(.)notes/[id]/page.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NotePreviewClient from "@/components/NotePreview/NotePreview.client";
import { useEffect, useCallback } from "react";

export default function NoteDetailsPageModal() {
  const currentPath = usePathname();
  const router = useRouter();

  const pathOnMount = currentPath;

  useEffect(() => {
    console.log("Modal mounted, current path:", pathOnMount);
    return () => console.log("Modal unmounted, current path:", pathOnMount);
  }, [pathOnMount]);

  if (!currentPath) {
    return null;
  }

  const segments = currentPath.split("/");
  const lastSegment = segments[segments.length - 1];
  const penultSegment = segments[segments.length - 2];

  const isNoteDetailsPath =
    !isNaN(parseFloat(lastSegment)) && penultSegment === "notes";

  if (!isNoteDetailsPath) {
    console.log("Path does not match /notes/[id], current path:", currentPath);
    return null;
  }

  const noteId: number = parseFloat(lastSegment);

  const handleCloseModal = useCallback(() => {
    console.log("Closing modal, current path:", currentPath);
    // Додаємо затримку для діагностики
    setTimeout(() => {
      router.back();
    }, 1000); // Затримка 1 секунда
  }, [currentPath, router]);

  return (
    <Modal onClose={handleCloseModal}>
      <NotePreviewClient id={noteId} />
    </Modal>
  );
}
