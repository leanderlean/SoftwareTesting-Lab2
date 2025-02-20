import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./home-page";
import { screen, within } from "@storybook/testing-library"; // ✅ Import `within`
import userEvent from "@testing-library/user-event";
import { expect } from '@storybook/jest';


export default {
  title: "Pages/HomePage",
  component: HomePage,
  decorators: [
    (Story) => (
      <MemoryRouter> 
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn<typeof HomePage> = () => <HomePage />;

// 📌 1️⃣ Default (Empty State)
export const Default = Template.bind({});
Default.play = async () => {
  localStorage.removeItem("notes"); // Ensure it's empty
};

// 📌 2️⃣ With Notes (Text Only)
export const WithOutFiles= Template.bind({});
WithOutFiles.play = async () => {
  localStorage.setItem(
    "notes",
    JSON.stringify([
      {
        name: "Leander Galido",
        subject: "Math",
        topic: "Algebra",
        description: "Basic Algebra Concepts",
      },
      {
        name: "Ahston Regalado",
        subject: "Science",
        topic: "Physics",
        description: "Introduction to Forces",
      },
    ])
  );
};

// 📌 3️⃣ With File Attachments (Simulates IndexedDB Storage)
export const WithFiles = Template.bind({});
WithFiles.play = async () => {
  localStorage.setItem(
    "notes",
    JSON.stringify([
      {
        name: "Leander Galido",
        subject: "Math",
        topic: "Algebra",
        description: "Basic Algebra Concepts",
        filePath: "math-notes.pdf",
      },
    ])
  );

  // Mock IndexedDB
  const dbRequest = indexedDB.open("NotesDB", 2);
  dbRequest.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");

    store.put({
      fileName: "math-notes.pdf",
      content: "data:application/pdf;base64,...", // Simulate file data
    });

    transaction.oncomplete = () => db.close();
  };
};

// 📌 4️⃣ Delete Note Play Function


export const DeleteAllNotes = Template.bind({});
DeleteAllNotes.play = async ({ canvasElement }) => {
  localStorage.setItem(
    "notes",
    JSON.stringify([
      { name: "Leander Galido", subject: "Math", topic: "Algebra", description: "Basic Algebra Concepts" },
      { name: "Lebron James", subject: "PE", topic: "Basketball", description: "How to dribble the ball" },
      { name: "Juan Gomez", subject: "EDA", topic: "Probability", description: "Topic 1" },
    ])
  );

  // ✅ Wait for the component to render notes
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const canvas = within(canvasElement);
  let notesAfterDelete = JSON.parse(localStorage.getItem("notes") || "[]");

  while (notesAfterDelete.length > 0) {
    // ✅ Find the latest delete buttons
    const deleteButtons = await screen.findAllByRole("button", { name: /delete/i });

    // ✅ If no buttons are found, exit the loop
    if (deleteButtons.length === 0) break;

    // ✅ Click the first delete button
    await userEvent.click(deleteButtons[0]);

    // ✅ Wait for UI update before continuing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // ✅ Re-fetch notes from localStorage after deletion
    notesAfterDelete = JSON.parse(localStorage.getItem("notes") || "[]");

    // ✅ If no notes are left, break the loop
    if (notesAfterDelete.length === 0) break;
  }

  // ✅ Final check: Ensure all notes are deleted
  expect(notesAfterDelete.length).toBe(0);

  // ✅ Check if all delete buttons are removed from the DOM
  const remainingButtons = await screen.queryAllByRole("button", { name: /delete/i });
  expect(remainingButtons.length).toBe(0);
};
