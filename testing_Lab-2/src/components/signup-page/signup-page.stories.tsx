import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";
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

export const Default: Story = {};

export const EmptyInputAlert: Story = {
  name: "Signup Without Input Triggers an Alert",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const signupButton = await canvas.getByRole("button", { name: /sign up/i });
    
    await userEvent.click(signupButton);
  },
};

export const PrefilledSignup: Story = {
  args: {
    initialName: "Leander Galido",
    initialEmail: "leander05@gmail.com",
    initialPassword: "qwertyuiop",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const nameInput = await canvas.getByPlaceholderText("Enter your name");
    const emailInput = await canvas.getByPlaceholderText("Enter your email");
    const passwordInput = await canvas.getByPlaceholderText("Enter your password");
    const signupButton = await canvas.getByRole("button", { name: /sign up/i });

    await userEvent.type(nameInput, "Leander Galido", {delay: 100});
    await userEvent.type(emailInput, "leander05@gmail.com", {delay: 100});
    await userEvent.type(passwordInput, "qwertyuiop", {delay: 100});
    
    await userEvent.click(signupButton);
  },
};

export const WithCallbacks: Story = {
  args: {
    onSignupSuccess: (name) => console.log(`Signup success: ${name}`),
    onSignupError: (error) => console.error(`Signup error: ${error}`),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const nameInput = await canvas.getByPlaceholderText("Enter your name");
    const emailInput = await canvas.getByPlaceholderText("Enter your email");
    const passwordInput = await canvas.getByPlaceholderText("Enter your password");
    const signupButton = await canvas.getByRole("button", { name: /sign up/i });

    await userEvent.type(nameInput, "Ashton Regalado", {delay: 100});
    await userEvent.type(emailInput, "ashton@gmal.com", {delay: 100});
    await userEvent.type(passwordInput, "12345678", {delay: 100});
    
    await userEvent.click(signupButton);
  },
};