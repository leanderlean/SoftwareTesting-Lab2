import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./home-page";
import { screen, within } from "@storybook/testing-library"; // ✅ Import `within`
import userEvent from "@testing-library/user-event";
import { expect } from "@storybook/jest";

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

export const Default = Template.bind({});
Default.play = async () => {
  localStorage.removeItem("notes");
};

export const WithOutFiles = Template.bind({});
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

  const dbRequest = indexedDB.open("NotesDB", 2);
  dbRequest.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");

    store.put({
      fileName: "math-notes.pdf",
      content: "data:application/pdf;base64,...",
    });

    transaction.oncomplete = () => db.close();
  };
};

export const DeleteAllNotes = Template.bind({});
DeleteAllNotes.play = async ({ canvasElement }) => {
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
        name: "Lebron James",
        subject: "PE",
        topic: "Basketball",
        description: "How to dribble the ball",
      },
      {
        name: "Juan Gomez",
        subject: "EDA",
        topic: "Probability",
        description: "Topic 1",
      },
    ])
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const canvas = within(canvasElement);
  let notesAfterDelete = JSON.parse(localStorage.getItem("notes") || "[]");

  while (notesAfterDelete.length > 0) {
    const deleteButtons = await screen.findAllByRole("button", {
      name: /delete/i,
    });

    if (deleteButtons.length === 0) break;

    await userEvent.click(deleteButtons[0]);

    await new Promise((resolve) => setTimeout(resolve, 500));

    notesAfterDelete = JSON.parse(localStorage.getItem("notes") || "[]");

    if (notesAfterDelete.length === 0) break;
  }

  expect(notesAfterDelete.length).toBe(0);

  const remainingButtons = await screen.queryAllByRole("button", {
    name: /delete/i,
  });
  expect(remainingButtons.length).toBe(0);
};
