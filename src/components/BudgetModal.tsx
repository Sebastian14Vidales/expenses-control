import { useBudget } from "../hooks/useBudget"
import ErrorMessage from "./ErrorMessage"
import { useState, useEffect } from "react"
import { DraftBudget } from "../types"
import { Input, Form } from "@nextui-org/react";
import {CalendarDate, DateValue, getLocalTimeZone, today } from "@internationalized/date";
import CustomDatePicker from "./CustomDatePicker";


export default function BudgetModal() {
    const { dispatch, state } = useBudget()
    const [error, setError] = useState('');

    const [incomeBudget, setIncomeBudget] = useState<DraftBudget>({
        name: "",
        budget: 0,
        date: today(getLocalTimeZone()),
    });

    useEffect(() => {
        if (state.editingIncomeId && state.currentType === "ingresos") {
            const budget = state.addPlusBudget.find((income) => income.id === state.editingIncomeId);
            if (budget) {
                setIncomeBudget(budget);
            }
        }

    }, [state.currentType, state.editingIncomeId, state.addPlusBudget]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        //create a new budget. This budget will be added to the state
        e.preventDefault();
        // validate
        if (Object.values(incomeBudget).includes('')) {
            setError('Todos los campos son obligatorios')
            setTimeout(() => {
                setError('')
            }, 3000);
            return
        }

        if (incomeBudget.date && incomeBudget.date > today(getLocalTimeZone())) {
            setError('Fecha inválida');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        if (state.editingIncomeId) {
            // getId the income to update
            dispatch({
                type: "update-income",
                payload: { income: { id: state.editingIncomeId, ...incomeBudget } },
            });

        } else {
            dispatch({ type: "add-plus-budget", payload: { budget: incomeBudget } });
        }

        // reset form
        setIncomeBudget({
            name: "",
            budget: 0,
            date: today(getLocalTimeZone()),
        })
        // close the modal
        dispatch({ type: 'close-modal' })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setIncomeBudget((prevBudget) => ({
            ...prevBudget,
            [name]: name === "budget" ? parseFloat(value) || 0 : value, // Parse amount as number
        }));
    }

    const handleChangePicker = (value: DateValue | null) => {
        setIncomeBudget((prevBudget) => ({
            ...prevBudget,
            date: value as CalendarDate | null 
        }));
    }

    return (
        <Form className="space-y-5 items-stretch" onSubmit={handleSubmit}>
            <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
                {state.editingIncomeId ? "Actualizar Ingreso" : ""}
            </legend>

            {error &&
                <ErrorMessage>{error}</ErrorMessage>
            }

            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xl">
                    Nombre de Ganancia:
                </label>
                <Input
                    size="lg"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Añade el nombre del Ingreso"
                    value={incomeBudget.name}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="budget" className="text-xl">
                    Cantidad:
                </label>
                <Input
                    size="lg"
                    type="number"
                    id="budget"
                    name="budget"
                    placeholder="Añade la cantidad del gasto: ej. 300"
                    value={incomeBudget.budget.toString()}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-xl">
                    Fecha Gasto:
                </label>
                <CustomDatePicker
                    className="max-w-full"
                    label="Fecha Ingreso"
                    value={incomeBudget.date}
                    onChange={handleChangePicker}
                    maxValue={today(getLocalTimeZone())}                    
                    aria-hidden={false}
                />
            </div>

            <Input
                size="md"
                type="submit"
                className="w-full p-2"
                color="primary"
                value={state.editingIncomeId ? "Actualizar Ingreso" : "Añadir Ingreso"}
                style={{ fontWeight: "bold", textTransform: "uppercase", cursor: "pointer" }}
            />
        </Form>
    )
}
