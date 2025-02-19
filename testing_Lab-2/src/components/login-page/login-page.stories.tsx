import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect, waitFor } from "@storybook/test";
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

export const PrefilledLogin: Story = {
  args: {
    initialEmail: "user@domain.com",
    initialPassword: "securepasswordforlife",
  },
};

export const LoginResponse: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the "Add Note" button
    await userEvent.click(canvas.getByRole("button", { name: /log in/i }));

    // Wait for the error message to appear
    await expect(
      canvas.findByText(
        /Incorrect email or password!|No account found!|`Welcome back ${storedName}!`/
      )
    ).resolves.toBeInTheDocument();
  },
};

export const UserInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByPlaceholderText("Enter your email"),
      "ash@gmail.com",
      { delay: 100 }
    );
    await userEvent.type(
      canvas.getByPlaceholderText("Enter your password"),
      "aaaaaaaa",
      { delay: 100 }
    );

    await userEvent.click(canvas.getByRole("button", { name: /Log in/i }));

    await waitFor(
      () => {
        expect(canvas.getByText(/Welcome back .*!/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  },
};
