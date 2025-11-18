import type { Meta, StoryObj } from '@storybook/react';
import RegistrationForm from './RegistrationForm';

const meta = {
  title: 'Components/RegistrationForm',
  component: RegistrationForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RegistrationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMockData: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El formulario completo de registro de consumo de alimentos con todos sus campos y validaciones. Incluye selección de usuario, fecha, hora, tipo de comida, alimento, cantidad, unidad, endulzante opcional y notas.',
      },
    },
  },
};
