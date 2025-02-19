import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";
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

export const Default: Story = {};

export const EmptyInputAlert: Story = {
  name: "Login Without Input Triggers an Alert",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = await canvas.getByRole("button", { name: /log in/i });

    await userEvent.click(loginButton);
  },
};

export const PrefilledLogin: Story = {
  args: {
    initialEmail: "user@domain.com",
    initialPassword: "securepasswordforlife",
  },
};

export const WithCallbacks: Story = {
  args: {
    onLoginSuccess: (email) => console.log(`Login success: ${email}`),
    onLoginError: (error) => console.error(`Login error: ${error}`),
  },
};
