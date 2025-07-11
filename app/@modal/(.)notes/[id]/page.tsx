// app/@modal/(.)notes/[id]/page.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NoteDetailsPageModal() {
  const currentPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    const segments = currentPath.split("/");
    const lastSegment = segments[segments.length - 1];
    const penultSegment = segments[segments.length - 2];

    const isNoteDetailsPath =
      !isNaN(parseFloat(lastSegment)) && penultSegment === "notes";

    if (isNoteDetailsPath) {
      const noteId = parseFloat(lastSegment);
      router.replace(`/notes/${noteId}`); // Перенаправлення без рендерингу
    } else {
      console.log(
        "Path does not match /notes/[id], current path:",
        currentPath,
      );
      router.replace("/notes/filter/All");
    }
  }, [currentPath, router]);

  return null;
}
