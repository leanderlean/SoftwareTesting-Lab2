/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../testing_Lab-2/src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
