import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect, waitFor } from "@storybook/test";
import { BrowserRouter } from "react-router-dom";
import AddNote from "./add-notes";

const meta: Meta<typeof AddNote> = {
  component: AddNote,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AddNote>;

export const Default: Story = {};

export const FilledInputs: Story = {
  name: "Filled inputs UI",
  args: {
    initialSubject: "Science",
    initialTopic: "Geology",
    initialDescription: "Notes about types of rocks.",
  },
};

export const ErrorState: Story = {
  name: "Error State UI",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the "Add Note" button
    await userEvent.click(canvas.getByRole("button", { name: /add note/i }));

    // Wait for the error message to appear
    await expect(
      canvas.findByText("Please fill all required fields!")
    ).resolves.toBeInTheDocument();
  },
};

export const UserInteraction: Story = {
  name: "Simulated User Interaction",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByPlaceholderText("Add Subject"), "Math");
    await userEvent.type(canvas.getByPlaceholderText("Add Topic"), "Algebra");
    await userEvent.type(
      canvas.getByPlaceholderText("Add Description"),
      "Notes for factoring"
    );

    const fileInput = canvas.getByTestId("file-input");
    const file = new File(["dummy content"], "notes.pdf", {
      type: "application/pdf",
    });
    await userEvent.upload(fileInput, file);

    await userEvent.click(canvas.getByRole("button", { name: /add note/i }));

    await waitFor(() => {
      expect(canvas.getByText("Note added successfully!")).toBeInTheDocument();
    });
  },
};
