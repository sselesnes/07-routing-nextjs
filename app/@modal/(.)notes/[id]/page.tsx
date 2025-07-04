// app/@modal/(.)notes/[id]/page.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NotePreviewClient from "@/components/NotePreview/NotePreview.client";
import { useEffect, useCallback } from "react";

export default function NoteDetailsPageModal() {
  const currentPath = usePathname();
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    console.log(
      "handleCloseModal called, current path:",
      currentPath,
      "Is this manual? Check Modal events",
    );
    setTimeout(() => {
      console.log("Executing router.back(), current path:", currentPath);
      router.back();
    }, 1000);
  }, [currentPath, router]);

  useEffect(() => {
    console.log("Modal mounted, current path:", currentPath);
    return () => console.log("Modal unmounted, current path:", currentPath);
  }, [currentPath]);

  if (!currentPath) {
    console.log("No current path, returning null");
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

  return (
    <Modal onClose={handleCloseModal}>
      <NotePreviewClient id={noteId} />
    </Modal>
  );
}
