import { categories } from "../data/categories";
import { useEffect, useState } from "react";
import { DraftExpense } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";
import { Input, Select, SelectItem, Form } from "@nextui-org/react";
import { DateValue, today, CalendarDate, getLocalTimeZone } from "@internationalized/date";
import CustomDatePicker from "./CustomDatePicker";

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        expenseName: "",
        amount: 0,
        category: "",
        date: today(getLocalTimeZone()),
    });

    const [error, setError] = useState('');
    const [previousAmount, setPreviousAmount] = useState(0);
    const { dispatch, state, remaining } = useBudget();

    useEffect(() => {
        if (state.editingId) {
            if (state.currentType === "gastos") {
                const expense = state.expenses.find((expense) => expense.id === state.editingId);
                if (!expense) return;
                setExpense(expense);
                setPreviousAmount(expense.amount);
            }
        }

    }, [state.editingId, state.currentType, state.editingIncomeId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setExpense((prevExpense) => ({
            ...prevExpense,
            [name]: name === "amount" ? parseFloat(value) || 0 : value, // Parse amount as number
        }));
    };

    const handleChangePicker = (value: DateValue | null) => {
        setExpense((prevExpense) => ({
            ...prevExpense,
            date: value as CalendarDate | null,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // validate
        if (Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        if (expense.date && expense.date > today(getLocalTimeZone())) {
            setError('Fecha inválida');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }
        
        // validate remaining
        if (state.currentType === 'gastos' && (expense.amount - previousAmount) > remaining) {
            setError('El gasto supera el presupuesto disponible');
            return;
        }

        if (state.editingId) {
            if (state.currentType === "gastos") {
                dispatch({
                    type: "update-expense",
                    payload: { expense: { id: state.editingId, ...expense } },
                });
            }
        } else {
            if (state.currentType === "gastos") {
                dispatch({ type: "add-expense", payload: { expense } });
            }
        }

        // reset form
        setExpense({
            expenseName: "",
            amount: 0,
            category: "",
            date: today(getLocalTimeZone()),
        });
        setPreviousAmount(0);
        // I'm going to close the modal
        dispatch({ type: 'close-modal' });
    };

    return (
        <Form className="space-y-5 items-stretch" onSubmit={handleSubmit}>
            {/* if the expense is editing */}
            <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
                {state.editingId ? 'Editar Gasto' : ''}
            </legend>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">
                    Nombre Gasto:
                </label>
                <Input
                    className="w-full"
                    size="lg"
                    type="text"
                    id="expenseName"
                    name="expenseName"
                    placeholder="Añade el nombre del gasto"
                    value={expense.expenseName}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">
                    Cantidad:
                </label>
                <Input
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="Añade la cantidad del gasto: ej. 300"
                    value={expense.amount.toFixed()}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">
                    Categoría:
                </label>
                <Select
                    id="category"
                    name="category"
                    label="Selecciona una categoría"
                    selectedKeys={expense.category ? [expense.category] : []}
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLSelectElement>)}
                >
                    {categories
                        .filter((category) => category.name !== "Ver todos")
                        .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-xl">
                    Fecha Gasto:
                </label>
                <CustomDatePicker
                    className="max-w-full"
                    label="Fecha de Gasto"
                    value={expense.date}
                    onChange={handleChangePicker}
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    aria-hidden={false}
                />
            </div>

            <Input
                size="md"
                type="submit"
                className="w-full p-2"
                color="primary"
                value={state.editingId ? 'Editar Gasto' : 'Registrar Gasto'}
                style={{ fontWeight: "bold", textTransform: "uppercase", cursor: "pointer" }}
            />
        </Form>
    );
}
