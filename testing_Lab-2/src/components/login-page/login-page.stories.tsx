import { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./login-page";

const meta: Meta<typeof Login> = {
  component: Login,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Login>;

export const Primary: Story = {
  name: "I am the primary",
  args: {
    primary: true,
    label: "Login",
  },
};
