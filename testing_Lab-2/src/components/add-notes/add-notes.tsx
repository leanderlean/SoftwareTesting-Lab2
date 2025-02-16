import React, { useState, useRef } from "react";
import styles from "./add-notes.module.css";
import { Link } from "react-router-dom";

interface Note {
  email: string | null;
  subject: string;
  topic: string;
  description: string;
  filePath?: string;
}

// ✅ Initialize IndexedDB properly
const initializeDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("NotesDB", 2); // 🔹 Use version 2 to ensure upgrade

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "fileName" });
      }
    };

    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = () => reject(new Error("Failed to open IndexedDB"));
  });
};

// ✅ Save file to IndexedDB
const saveFileToIndexedDB = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB();
      const reader = new FileReader();

      reader.onload = () => {
        const transaction = db.transaction("files", "readwrite");
        const store = transaction.objectStore("files");

        const fileData = {
          fileName: file.name,
          content: reader.result, // Base64 encoded file
        };

        const putRequest = store.put(fileData);
        putRequest.onsuccess = () => resolve(file.name);
        putRequest.onerror = () => reject(new Error("Failed to store file"));
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

// ✅ Main component
const AddNote: React.FC = () => {
  const email = localStorage.getItem("loggedEmail");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Handle adding a note
  const handleAddNote = async () => {
    if (!subject || !topic || !description) {
      alert("Please fill all required fields.");
      return;
    }

    let filePath = "";
    if (file) {
      try {
        filePath = await saveFileToIndexedDB(file);
      } catch (error) {
        console.error("Error saving file:", error);
        return; // Stop execution if file saving fails
      }
    }

    const newNote: Note = { email, subject, topic, description, filePath };

    // Retrieve current notes and update state
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = [...storedNotes, newNote];

    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    // Reset form fields
    setSubject("");
    setTopic("");
    setDescription("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    alert("Note added successfully!");
  };

  return (
    <div className={styles.container}>
      <Link to="/home-page">
        <button className={styles.backButton}>Back to Home Page</button>
      </Link>

      <h2>ADD NOTE</h2>

      <input
        className={styles.input}
        value={subject}
        placeholder="Add Subject"
        onChange={(e) => setSubject(e.target.value)}
      />
      <input
        className={styles.input}
        value={topic}
        placeholder="Add Topic"
        onChange={(e) => setTopic(e.target.value)}
      />
      <input
        className={styles.input}
        value={description}
        placeholder="Add Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <input
        className={styles.input}
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleAddNote} className={styles.button}>
        Add Note
      </button>
    </div>
  );
};

export default AddNote;
