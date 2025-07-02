//NotePreviewModal.client.tsx

"use client";

import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";

interface NotePreviewModalProps {
  id: number;
  tag?: string;
  page?: number;
  onClose: () => void;
}

export default function NotePreviewModal({
  id,
  tag,
  page,
  onClose,
}: NotePreviewModalProps) {
  return (
    <Modal onClose={onClose}>
      <NotePreview id={id} onClose={onClose} />
    </Modal>
  );
}
