import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./home-page.module.css";

interface Note {
  name: string | null;
  subject: string;
  topic: string;
  description: string;
  filePath?: string;
}

// Ensure IndexedDB is properly initialized
const initializeDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("NotesDB", 2); // 🔹 Force upgrade if needed

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "fileName" });
        console.log("Created 'files' object store");
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // 🔹 Ensure 'files' store exists before resolving
      if (!db.objectStoreNames.contains("files")) {
        console.error("'files' store does not exist!");
        return reject(new Error("IndexedDB error: 'files' store missing"));
      }

      resolve(db);
    };

    request.onerror = () => reject(new Error("Failed to open IndexedDB"));
  });
};

const HomePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [fileURLs, setFileURLs] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  //Load notes from localStorage on page load
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(storedNotes);
  }, []);

  // Fetch files from IndexedDB
  useEffect(() => {
    if (notes.length === 0) return;

    const fetchFiles = async () => {
      try {
        setLoading(true);
        const db = await initializeDB(); // Ensure DB is initialized
        const transaction = db.transaction("files", "readonly");
        const store = transaction.objectStore("files");
        const fileURLsMap: { [key: string]: string } = {};

        await Promise.all(
          notes.map((note) =>
            note.filePath
              ? new Promise<void>((resolve) => {
                  const getRequest = store.get(note.filePath);
                  getRequest.onsuccess = () => {
                    if (getRequest.result) {
                      fileURLsMap[note.filePath!] = getRequest.result.content;
                    }
                    resolve();
                  };
                  getRequest.onerror = () => resolve();
                })
              : Promise.resolve()
          )
        );

        setFileURLs(fileURLsMap);
        transaction.oncomplete = () => db.close();
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [notes]);
  
  const deleteNote = async (noteToDelete: Note) => {
    // Get existing notes
    const storedNotes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
  
    // Ensure we're filtering correctly by checking unique properties (not by reference)
    const updatedNotes = storedNotes.filter((note) => note.subject !== noteToDelete.subject || note.topic !== noteToDelete.topic);
  
    // Update localStorage
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  
    // If the note has an associated file, delete it from IndexedDB
    if (noteToDelete.filePath) {
      try {
        const db = await initializeDB();
        const transaction = db.transaction("files", "readwrite");
        const store = transaction.objectStore("files");
  
        const deleteRequest = store.delete(noteToDelete.filePath);
  
        deleteRequest.onsuccess = () => {
          console.log("File deleted from IndexedDB:", noteToDelete.filePath);
  
          // Update the state AFTER ensuring file deletion
          setNotes([...updatedNotes]); // Force state update
        };
  
        deleteRequest.onerror = () => {
          console.error("Failed to delete file from IndexedDB");
        };
  
        transaction.oncomplete = () => db.close();
      } catch (error) {
        console.error("Error deleting file from IndexedDB:", error);
      }
    } else {
      // Update state if no file exists
      setNotes([...updatedNotes]); // Force state update
    }
  };

  return (
    <div className={styles.displayNotesCont}>
      <Link to="/add-notes">
        <button className={styles.backButton}>Add Note</button>
      </Link>

      <h2 className={styles.h2}>My Notes</h2>

      <div className={styles.notesContainer}>
        <ul id="myNotes">
          {notes.map((note, index) => (
            <li key={index} className={styles.notes}>
              <strong>Subject:</strong> {note.subject} <br />
              <strong>Topic:</strong> {note.topic} <br />
              <strong>Description:</strong> {note.description} <br />

              {note.filePath && fileURLs[note.filePath] ? (
                <a href={fileURLs[note.filePath]} download={note.filePath}>
                  <button className={styles.downloadButton}>Download</button>
                </a>
              ) : (
                note.filePath && <p>Loading file...</p>
              )}

            <button onClick={() => deleteNote(note)} className={styles.deleteButton}>
              Delete
            </button> 

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
