"use client";
import Modal from "@/components/Modal";
import type { ConfirmDialogProps } from "@/lib/types/ui";

export default function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel, className = "" }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      className={className}
      footer={(
        <div className="w-full flex items-center justify-end gap-2">
          <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      )}
    >
      {description && <div className="text-sm text-zinc-300">{description}</div>}
    </Modal>
  );
}

