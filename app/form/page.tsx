import RegistrationForm from "@/app/components/RegistrationForm/RegistrationForm";

export default function FormPage() {
  return (
    <main
      className="min-h-screen py-10 flex items-center justify-center"
      style={{ background: "var(--color-background)" }}
    >
      <div
        className="max-w-2xl w-full mx-auto rounded-2xl shadow-2xl p-10"
        style={{ background: "var(--color-surface)" }}
      >
        <h2
          className="text-4xl font-extrabold mb-8 text-center text-(--color-accent) tracking-tight"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
        >
          Formulario de Registro
        </h2>
        <RegistrationForm />
      </div>
    </main>
  );
}
<h2
  className="text-4xl font-extrabold mb-8 text-center text-(--color-primary) tracking-tight"
  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
>
  Formulario de Registro
</h2>;
