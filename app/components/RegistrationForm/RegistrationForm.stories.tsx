import type { Meta, StoryObj } from '@storybook/react';
import RegistrationForm from './RegistrationForm';

// Mock the localStorage functions for Storybook
const mockGetAllUsers = () => [
  { id: '1', name: 'Juan Pérez' },
  { id: '2', name: 'María García' },
  { id: '3', name: 'Carlos López' },
];

const mockSaveRegister = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    success: true,
    message: 'Registro guardado correctamente',
  };
};

const meta = {
  title: 'Components/RegistrationForm',
  component: RegistrationForm,
  parameters: {
    layout: 'centered',
    mockData: [
      {
        url: '/api/users',
        method: 'GET',
        status: 200,
        response: mockGetAllUsers(),
      },
    ],
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
