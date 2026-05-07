"use client";

import { type DragEvent, type ChangeEvent, useRef, useState } from "react";
import { createItem } from "@/app/actions";

const categories = ["Vedtægter", "Referater", "Anekdoter", "Ture", "Dokumenter", "Nyheder", "Andet"];

export function ItemForm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  function openModal() {
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  function updateSelectedFile(file?: File) {
    setFileName(file?.name ?? "");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    updateSelectedFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];

    if (!file || !inputRef.current) {
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputRef.current.files = transfer.files;
    updateSelectedFile(file);
  }

  return (
    <>
      <button className="button" onClick={openModal} type="button">
        + Tilføj fil
      </button>

      <dialog className="item-dialog" ref={dialogRef}>
        <form action={createItem} className="item-form">
          <div className="modal-header">
            <div>
              <p className="eyebrow">Item</p>
              <h2>Tilføj fil</h2>
            </div>
            <button className="icon-button" onClick={closeModal} type="button" aria-label="Luk">
              ×
            </button>
          </div>

          <div className="item-form-grid">
            <div className="item-fields">
              <div className="field field-dark">
                <label htmlFor="document-title">Titel</label>
                <input id="document-title" name="title" required type="text" />
              </div>
              <div className="field field-dark">
                <label htmlFor="document-description">Beskrivelse</label>
                <textarea id="document-description" name="description" />
              </div>
              <div className="field field-dark">
                <label htmlFor="document-category">Kategori</label>
                <select id="document-category" name="category" required>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field field-dark">
                <label htmlFor="document-access">Adgang</label>
                <select id="document-access" name="accessLevel" required>
                  <option value="all">Alle</option>
                  <option value="admins">Admins</option>
                </select>
              </div>
            </div>

            <label
              className="item-file-dropzone"
              htmlFor="document-file"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                id="document-file"
                name="file"
                onChange={handleFileChange}
                ref={inputRef}
                required
                type="file"
              />
              <span>{fileName || "Klik eller træk en fil hertil"}</span>
            </label>
          </div>

          <div className="modal-actions">
            <button className="button button-secondary" onClick={closeModal} type="button">
              Annuller
            </button>
            <button className="button" type="submit">
              Gem item
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
