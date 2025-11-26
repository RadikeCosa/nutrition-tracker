"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useWatch,
  type SubmitHandler,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInputSchema } from "../../lib/schemas/register.schema";
import type { RegisterInput } from "../../lib/schemas/register.schema";
import { saveRegister } from "../../lib/storage/localStorage";
import { getAllUsers } from "../../lib/user-helpers";
import { FeedbackMessage } from "./FeedbackMessage";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { RadioGroup } from "../ui/RadioGroup";
import { Button } from "../ui/Button";

import {
  UNIT_LABELS,
  MEAL_TYPE_LABELS,
  SWEETENER_LABELS,
  unitOptions,
  mealTypeOptions,
  sweetenerOptions,
} from "../../constants/labels";

const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toISOString().split("T")[0] as string,
    time: now.toTimeString().slice(0, 5),
  };
};

const RegistrationForm: React.FC = () => {
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const router = useRouter();

  const users = getAllUsers();
  const { date: currentDate, time: currentTime } = useMemo(
    () => getCurrentDateTime(),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm<RegisterInput>({
    // Cast para alinear tipos cuando hay coerce/preprocess en Zod
    resolver: zodResolver(RegisterInputSchema) as Resolver<RegisterInput>,
    defaultValues: {
      food: "",
      amount: 1,
      unit: "unit",
      date: currentDate,
      time: currentTime,
      mealType: "breakfast",
      sweetener: null,
      notes: "",
      userId: "",
      userName: "",
    },
  });

  const selectedUserId = useWatch({ control, name: "userId" });
  const mealTypeValue = useWatch({ control, name: "mealType" });
  const unitValue = useWatch({ control, name: "unit" });
  const sweetenerValue = useWatch({ control, name: "sweetener" });

  // Auto-ocultar mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (feedback?.type === "success") {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Autocompletar userName cuando cambia userId
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setValue("userId", userId);

    const user = users.find((u) => u.id === userId);
    setValue("userName", user?.name ?? "");
  };

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    setFeedback(null);

    const result = await saveRegister(data);

    if (result?.success) {
      setFeedback({
        type: "success",
        message: result.message || "Registro guardado correctamente",
      });

      const { date, time } = getCurrentDateTime();
      reset({
        food: "",
        amount: 1,
        unit: "unit",
        date,
        time,
        mealType: "breakfast",
        sweetener: null,
        notes: "",
        userId: selectedUserId,
        userName: data.userName,
      });

      // Redirigir a dashboard después de registro exitoso
      router.push("/dashboard");
    } else {
      setFeedback({
        type: "error",
        message: result?.error?.message || "Error al guardar el registro",
      });
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-lg shadow-lg"
      style={{ background: "var(--color-background)" }}
    >
      <fieldset
        className="space-y-6 border-2 border-(--color-accent)/30 rounded-xl p-6 bg-(--color-surface-light) shadow-md"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          background: "var(--color-surface-light)",
        }}
      >
        <legend
          className="text-xl font-extrabold text-(--color-accent) mb-4 tracking-tight"
          style={{ letterSpacing: "-1px" }}
        >
          Registro de Consumo de Alimentos
        </legend>

        <div>
          <Label htmlFor="userId" required>
            Usuario
          </Label>
          <Select
            id="userId"
            {...register("userId")}
            onChange={handleUserChange}
            aria-invalid={!!errors.userId}
            hasError={!!errors.userId}
          >
            <option value="">Selecciona un usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
          <ErrorMessage message={errors.userId?.message} />
        </div>

        <div>
          <Label htmlFor="date" required>
            Fecha
          </Label>
          <Input
            type="date"
            id="date"
            {...register("date")}
            aria-invalid={!!errors.date}
            hasError={!!errors.date}
          />
          <ErrorMessage message={errors.date?.message} />
        </div>

        <div>
          <Label htmlFor="time" required>
            Hora
          </Label>
          <Input
            type="time"
            id="time"
            {...register("time")}
            aria-invalid={!!errors.time}
            hasError={!!errors.time}
          />
          <ErrorMessage message={errors.time?.message} />
        </div>

        <div>
          <Label htmlFor="mealType" required>
            Tipo de Comida
          </Label>
          <RadioGroup
            name="mealType"
            value={mealTypeValue}
            onChange={(value) =>
              setValue("mealType", value as RegisterInput["mealType"])
            }
            options={mealTypeOptions.map((type) => ({
              value: type,
              label: MEAL_TYPE_LABELS[type],
            }))}
            hasError={!!errors.mealType}
            layout="grid"
          />
          <ErrorMessage message={errors.mealType?.message} />
        </div>

        <div>
          <Label htmlFor="food" required>
            Alimento
          </Label>
          <Input
            type="text"
            id="food"
            {...register("food")}
            aria-invalid={!!errors.food}
            hasError={!!errors.food}
            placeholder="Ej. Manzana, Pan integral, Yogur"
          />
          <ErrorMessage message={errors.food?.message} />
        </div>

        <div>
          <Label htmlFor="amount" required>
            Cantidad
          </Label>
          <Input
            type="number"
            id="amount"
            min="0.5"
            step="0.5"
            {...register("amount", { valueAsNumber: true })}
            aria-invalid={!!errors.amount}
            hasError={!!errors.amount}
          />
          <ErrorMessage message={errors.amount?.message} />
        </div>

        <div>
          <Label htmlFor="unit" required>
            Unidad
          </Label>
          <RadioGroup
            name="unit"
            value={unitValue}
            onChange={(value) =>
              setValue("unit", value as RegisterInput["unit"])
            }
            options={unitOptions.map((unit) => ({
              value: unit,
              label: UNIT_LABELS[unit],
            }))}
            hasError={!!errors.unit}
            layout="grid"
          />
          <ErrorMessage message={errors.unit?.message} />
        </div>

        <div>
          <Label htmlFor="sweetener">Endulzante</Label>
          <RadioGroup
            name="sweetener"
            value={sweetenerValue || ""}
            onChange={(value) =>
              setValue(
                "sweetener",
                value ? (value as RegisterInput["sweetener"]) : null
              )
            }
            options={[
              { value: "", label: "Ninguno" },
              ...sweetenerOptions.map((sweetener) => ({
                value: sweetener,
                label: SWEETENER_LABELS[sweetener],
              })),
            ]}
            hasError={!!errors.sweetener}
            layout="vertical"
          />
          <ErrorMessage message={errors.sweetener?.message} />
        </div>

        <div>
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            rows={2}
            {...register("notes")}
            aria-invalid={!!errors.notes}
            hasError={!!errors.notes}
            placeholder="Opcional. Ej: Sin sal, pequeño, con leche"
          />
          <ErrorMessage message={errors.notes?.message} />
        </div>

        {feedback && (
          <div>
            <FeedbackMessage type={feedback.type} message={feedback.message} />
          </div>
        )}

        <div>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant="primary"
            className="w-full shadow-xl border-2 border-(--color-accent) bg-(--color-accent) text-lg font-bold py-3"
          >
            {isSubmitting ? "Guardando..." : "Guardar Registro"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default RegistrationForm;
