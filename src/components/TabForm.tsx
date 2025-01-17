import { Tab } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useBudget } from "../hooks/useBudget";
import BudgetModal from "./BudgetModal";

export default function TabForm() {

    const { state } = useBudget();

    if (state.editingId) {
        return <ExpenseForm />;
    } else if (state.editingIncomeId) {
        return <BudgetModal />;
    }
    return (
        <Tab.Group>
            <Tab.List className="flex justify-center p-1 rounded-lg gap-5 font-bold" style={{ backgroundColor: "rgba(30, 58, 138, 0.2)" }}>
                <Tab
                    className={({ selected }) =>
                        `text-sm sm:text-md p-1 uppercase flex-1 sm:p-2 rounded-lg ${selected ? "bg-blue-600 text-white" : "bg-white text-blue-600"
                        }`
                    }
                >
                    Nuevo Gasto
                </Tab>
                <Tab
                    className={({ selected }) =>
                        `text-sm p-1 sm:text-md uppercase flex-1 sm:p-2 rounded-lg ${selected ? "bg-blue-600 text-white" : "bg-white text-blue-600"
                        }`
                    }
                >
                    Ingresar Más Presupuesto
                </Tab>
            </Tab.List>
            <Tab.Panels>
                <Tab.Panel>
                    <ExpenseForm />
                </Tab.Panel>
                <Tab.Panel>
                    <BudgetModal />
                </Tab.Panel>
            </Tab.Panels>

        </Tab.Group>
    )
}
