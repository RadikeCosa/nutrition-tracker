import React, { useState, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterInputSchema,
  type RegisterInput,
} from "../../lib/schemas/register.schema.js";
import { saveRegister } from "../../lib/storage/localStorage.js";
import { getAllUsers } from "../../lib/user-helpers.js";
import { FeedbackMessage } from "./FeedbackMessage.js";
import {
  UNIT_LABELS,
  MEAL_TYPE_LABELS,
  SWEETENER_LABELS,
  unitOptions,
  mealTypeOptions,
  sweetenerOptions,
} from "../../constants/labels.js";

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
    watch,
  } = useForm<RegisterInput>({
    // Cast para alinear tipos cuando hay coerce/preprocess en Zod
    resolver: zodResolver(RegisterInputSchema) as any,
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

  const selectedUserId = watch("userId");

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
    } else {
      setFeedback({
        type: "error",
        message: result?.error?.message || "Error al guardar el registro",
      });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Registro de Consumo de Alimentos</legend>

        {feedback && (
          <FeedbackMessage type={feedback.type} message={feedback.message} />
        )}

        <div>
          <label htmlFor="userId">Usuario *</label>
          <select
            id="userId"
            {...register("userId")}
            onChange={handleUserChange}
          >
            <option value="">Selecciona un usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.userId && (
            <span style={{ color: "red" }}>{errors.userId.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="date">Fecha *</label>
          <input type="date" id="date" {...register("date")} />
          {errors.date && (
            <span style={{ color: "red" }}>{errors.date.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="time">Hora *</label>
          <input type="time" id="time" {...register("time")} />
          {errors.time && (
            <span style={{ color: "red" }}>{errors.time.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="mealType">Tipo de Comida *</label>
          <select id="mealType" {...register("mealType")}>
            {mealTypeOptions.map((type) => (
              <option key={type} value={type}>
                {MEAL_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          {errors.mealType && (
            <span style={{ color: "red" }}>{errors.mealType.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="food">Alimento *</label>
          <input type="text" id="food" {...register("food")} />
          {errors.food && (
            <span style={{ color: "red" }}>{errors.food.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="amount">Cantidad *</label>
          <input
            type="number"
            id="amount"
            min="0.01"
            step="0.01"
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && (
            <span style={{ color: "red" }}>{errors.amount.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="unit">Unidad *</label>
          <select id="unit" {...register("unit")}>
            {unitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]}
              </option>
            ))}
          </select>
          {errors.unit && (
            <span style={{ color: "red" }}>{errors.unit.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="sweetener">Endulzante</label>
          <select
            id="sweetener"
            aria-label="Endulzante"
            {...register("sweetener")}
          >
            <option value="">Ninguno</option>
            <option value="sugar">Azúcar</option>
            <option value="sweetener">Edulcorante</option>
          </select>
          {errors.sweetener && (
            <span style={{ color: "red" }}>{errors.sweetener.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="notes">Notas</label>
          <textarea id="notes" rows={2} {...register("notes")} />
          {errors.notes && (
            <span style={{ color: "red" }}>{errors.notes.message}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Registro"}
        </button>
      </fieldset>
    </form>
  );
};

export default RegistrationForm;
