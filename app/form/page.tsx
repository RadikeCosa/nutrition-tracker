import RegistrationForm from "@/app/components/RegistrationForm/RegistrationForm";

export default function FormPage() {
  return (
    <main className="bg-vanilla min-h-screen py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h2 className="text-3xl font-bold text-melon mb-8 text-center">
          Formulario de Registro
        </h2>
        <RegistrationForm />
      </div>
    </main>
  );
}
