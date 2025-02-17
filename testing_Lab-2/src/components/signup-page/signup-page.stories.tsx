import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "./signup-page";

const meta: Meta<typeof Signup> = {
  component: Signup,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Signup>;

export const Primary: Story = {
  name: "I am the primary",
  args: {
    label: "Signup",
    primary: true,
  },
};
