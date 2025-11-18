import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'UI/Select',
  component: Select,
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
      description: 'Disables the select when true',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
};

export const WithOptions: Story = {
  args: {
    options: [
      { value: 'opt1', label: 'First Option' },
      { value: 'opt2', label: 'Second Option' },
      { value: 'opt3', label: 'Third Option' },
    ],
  },
};

export const WithError: Story = {
  args: {
    hasError: true,
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
      </>
    ),
  },
};

export const WithValue: Story = {
  args: {
    value: 'option2',
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
};

export const ManyOptions: Story = {
  args: {
    children: (
      <>
        <option value="">Select a country</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
        <option value="au">Australia</option>
        <option value="de">Germany</option>
        <option value="fr">France</option>
        <option value="es">Spain</option>
        <option value="it">Italy</option>
        <option value="jp">Japan</option>
        <option value="cn">China</option>
      </>
    ),
  },
};
