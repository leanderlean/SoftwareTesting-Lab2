import { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./home-page";

const meta: Meta<typeof HomePage> = {
  component: HomePage,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof HomePage>;

export const Primary: Story = {
  name: "I am the primary",
  args: {
    primary: true,
    label: "Login",
  },
};
