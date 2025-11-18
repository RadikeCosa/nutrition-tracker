import type { Meta, StoryObj } from '@storybook/react';
import { FeedbackMessage } from './FeedbackMessage';

const meta = {
  title: 'Components/FeedbackMessage',
  component: FeedbackMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error'],
      description: 'Type of feedback message',
    },
    message: {
      control: 'text',
      description: 'Message content to display',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeedbackMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    type: 'success',
    message: 'El registro ha sido guardado correctamente',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    message: 'Ha ocurrido un error al guardar el registro',
  },
};

export const LongSuccessMessage: Story = {
  args: {
    type: 'success',
    message:
      'Tu registro de consumo de alimentos ha sido guardado exitosamente en la base de datos. Puedes continuar registrando más alimentos o ver tu historial.',
  },
};

export const LongErrorMessage: Story = {
  args: {
    type: 'error',
    message:
      'No se pudo guardar el registro debido a un problema de conexión con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.',
  },
};

export const ValidationError: Story = {
  args: {
    type: 'error',
    message: 'Por favor, completa todos los campos requeridos antes de continuar',
  },
};

export const ShortSuccess: Story = {
  args: {
    type: 'success',
    message: '¡Éxito!',
  },
};

export const ShortError: Story = {
  args: {
    type: 'error',
    message: 'Error',
  },
};
