import React, { useState, useEffect } from "react";

interface Note {
  email: string | null;
  subject: string;
  topic: string;
  description: string;
}

const AddNote: React.FC = () => {
  const email = localStorage.getItem("loggedEmail");
  const [subject, setSubject] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>(() => {
    return JSON.parse(localStorage.getItem("notes") || "[]");
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (!subject || !topic || !description) return;
    const newNote: Note = { email, subject, topic, description };
    const updatedNotes = [...notes, newNote];

    setNotes(updatedNotes);
    setSubject("");
    setTopic("");
    setDescription("");
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
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default AddNote;
