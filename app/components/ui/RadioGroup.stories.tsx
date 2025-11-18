import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';
import { useState } from 'react';

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'grid'],
      description: 'Layout style for the radio buttons',
    },
    hasError: {
      control: 'boolean',
      description: 'Shows error styling when true',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export const Default: Story = {
  args: {
    name: 'basic-radio',
    options: basicOptions,
  },
};

export const VerticalLayout: Story = {
  args: {
    name: 'vertical-radio',
    options: basicOptions,
    layout: 'vertical',
  },
};

export const GridLayout: Story = {
  args: {
    name: 'grid-radio',
    options: basicOptions,
    layout: 'grid',
  },
};

export const WithSelectedValue: Story = {
  args: {
    name: 'selected-radio',
    value: 'option2',
    options: basicOptions,
    layout: 'vertical',
  },
};

export const WithError: Story = {
  args: {
    name: 'error-radio',
    hasError: true,
    options: basicOptions,
    layout: 'vertical',
  },
};

export const ManyOptions: Story = {
  args: {
    name: 'many-radio',
    layout: 'grid',
    options: [
      { value: 'opt1', label: 'Desayuno' },
      { value: 'opt2', label: 'Almuerzo' },
      { value: 'opt3', label: 'Cena' },
      { value: 'opt4', label: 'Snack Mañana' },
      { value: 'opt5', label: 'Snack Tarde' },
      { value: 'opt6', label: 'Snack Noche' },
    ],
  },
};

// Interactive example
const InteractiveTemplate = (args: Story['args']) => {
  const [value, setValue] = useState(args?.value || '');
  
  return (
    <div>
      <RadioGroup
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args?.onChange?.(newValue);
        }}
      />
      <p className="mt-4 text-sm text-gray-600">Selected value: {value || 'None'}</p>
    </div>
  );
};

export const Interactive: Story = {
  render: InteractiveTemplate,
  args: {
    name: 'interactive-radio',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
    ],
    layout: 'vertical',
  },
};

export const Units: Story = {
  args: {
    name: 'units-radio',
    value: 'grams',
    layout: 'grid',
    options: [
      { value: 'unit', label: 'Unidad' },
      { value: 'grams', label: 'Gramos' },
      { value: 'ml', label: 'Mililitros' },
      { value: 'cup', label: 'Taza' },
      { value: 'tbsp', label: 'Cucharada' },
      { value: 'tsp', label: 'Cucharadita' },
    ],
  },
};
