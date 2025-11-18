import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    hasError: {
      control: 'boolean',
      description: 'Shows error styling when true',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the textarea when true',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your notes here...',
    rows: 3,
  },
};

export const WithValue: Story = {
  args: {
    value:
      'This is a sample text in the textarea component. It can span multiple lines and contains example content.',
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    hasError: true,
    value: 'This textarea has an error',
    rows: 3,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'This textarea is disabled',
    rows: 3,
  },
};

export const LargeTextarea: Story = {
  args: {
    placeholder: 'Write a detailed description...',
    rows: 8,
  },
};

export const SmallTextarea: Story = {
  args: {
    placeholder: 'Brief note...',
    rows: 2,
  },
};

export const LongContent: Story = {
  args: {
    value:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    rows: 6,
  },
};
