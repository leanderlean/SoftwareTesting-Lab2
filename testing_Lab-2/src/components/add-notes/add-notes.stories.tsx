import type { Meta, StoryObj } from "@storybook/react";
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

export const Primary: Story = {
  name: "I am the primary",
  args: {
    label: "AddNote",
    primary: true,
  },
};
