import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    required: {
      control: 'boolean',
      description: 'Shows required asterisk when true',
    },
    children: {
      control: 'text',
      description: 'Label text',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    htmlFor: 'example-input',
    children: 'Example Label',
  },
};

export const Required: Story = {
  args: {
    htmlFor: 'required-input',
    children: 'Required Field',
    required: true,
  },
};

export const LongText: Story = {
  args: {
    htmlFor: 'long-text',
    children: 'This is a longer label with more descriptive text',
  },
};

export const WithCustomClass: Story = {
  args: {
    htmlFor: 'custom-input',
    children: 'Custom Styled Label',
    className: 'text-blue-600',
  },
};
