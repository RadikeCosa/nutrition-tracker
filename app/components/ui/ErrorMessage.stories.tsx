import type { Meta, StoryObj } from '@storybook/react';
import { ErrorMessage } from './ErrorMessage';

const meta = {
  title: 'UI/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Error message to display',
    },
    id: {
      control: 'text',
      description: 'ID for aria-describedby linking',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'This field is required',
  },
};

export const ValidationError: Story = {
  args: {
    message: 'Please enter a valid email address',
  },
};

export const LongMessage: Story = {
  args: {
    message:
      'The password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters',
  },
};

export const WithId: Story = {
  args: {
    message: 'Invalid input',
    id: 'input-error',
  },
};

export const NoMessage: Story = {
  args: {
    message: undefined,
  },
};

export const EmptyMessage: Story = {
  args: {
    message: '',
  },
};

export const CustomClass: Story = {
  args: {
    message: 'Custom styled error',
    className: 'font-bold',
  },
};
