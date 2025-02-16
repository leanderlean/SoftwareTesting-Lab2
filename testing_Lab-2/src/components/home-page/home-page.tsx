import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import styles from "./home-page.module.css";

interface Note {
  name: string | null;
  subject: string;
  topic: string;
  description: string;
  filePath?: string;
}

const HomePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [fileURLs, setFileURLs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(storedNotes);
  }, []);

  const fetchStoredFiles = useCallback(() => {
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

  return (
    <div className={styles.displayNotesCont}>
      <h2>My Notes</h2>
      <Link to="/upload">
        <button>Add Note</button>
      </Link>
      <div className={styles.notesContainer}>
        <ul id="myNotes">
          {notes.map((note, index) => (
            <li key={index} className={styles.notes}>
              <strong>Subject:</strong> {note.subject} <br />
              <strong>Topic:</strong> {note.topic} <br />
              <strong>Description:</strong> {note.description} <br />
              {note.filePath && fileURLs[note.filePath] ? (
                <a href={fileURLs[note.filePath]} download={note.filePath}>
                  <button>Download</button>
                </a>
              ) : (
                note.filePath && <p>Loading file...</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
