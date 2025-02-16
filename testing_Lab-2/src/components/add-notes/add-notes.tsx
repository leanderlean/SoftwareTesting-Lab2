import React, { useState, useEffect, useCallback, useRef } from "react";

interface Note {
  email: string | null;
  subject: string;
  topic: string;
  description: string;
  filePath?: string;
}

const AddNote: React.FC = () => {
  const email = localStorage.getItem("loggedEmail");
  const [subject, setSubject] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState<Note[]>(() => {
    return JSON.parse(localStorage.getItem("notes") || "[]");
  });
  const [fileURLs, setFileURLs] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const saveFileToIndexedDB = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const request = indexedDB.open("NotesDB", 1);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains("files")) {
            db.createObjectStore("files", { keyPath: "fileName" });
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction("files", "readwrite");
          const store = transaction.objectStore("files");

          const fileData = {
            fileName: file.name,
            content: reader.result, // Store base64 content
          };

          const putRequest = store.put(fileData);
          putRequest.onsuccess = () => resolve(file.name);
          putRequest.onerror = () => reject(new Error("Failed to store file"));

          transaction.oncomplete = () => db.close();
        };

        request.onerror = () => reject(new Error("Failed to open IndexedDB"));
      };

      reader.readAsDataURL(file);
    });
  };

  const fetchStoredFiles = useCallback(() => {
    if (notes.length === 0) return; // Avoid unnecessary DB queries

    const request = indexedDB.open("NotesDB", 1);
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("files", "readonly");
      const store = transaction.objectStore("files");
      const fileURLsMap: { [key: string]: string } = {};

      notes.forEach((note) => {
        if (note.filePath) {
          const getRequest = store.get(note.filePath);
          getRequest.onsuccess = () => {
            if (getRequest.result) {
              fileURLsMap[note.filePath!] = getRequest.result.content;
              setFileURLs((prev) => ({ ...prev, ...fileURLsMap }));
            }
          };
        }
      });

      transaction.oncomplete = () => db.close();
    };
  }, [notes]);

  useEffect(() => {
    fetchStoredFiles();
  }, [fetchStoredFiles]);

  const handleAddNote = async () => {
    if (!subject || !topic || !description) return;

    let filePath = "";
    if (file) {
      try {
        filePath = await saveFileToIndexedDB(file);
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }

    const newNote: Note = { email, subject, topic, description, filePath };
    const updatedNotes = [...notes, newNote];

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes)); // Save to localStorage

    setSubject("");
    setTopic("");
    setDescription("");
    setFile(null);

    // ✅ Clear file input correctly
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <h2>ADD NOTE</h2>
      <input
        value={subject}
        placeholder="Add Subject"
        onChange={(e) => setSubject(e.target.value)}
      />
      <input
        value={topic}
        placeholder="Add Topic"
        onChange={(e) => setTopic(e.target.value)}
      />
      <input
        value={description}
        placeholder="Add Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default AddNote;
