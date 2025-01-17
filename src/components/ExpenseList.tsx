import { useMemo } from "react";
import { useBudget } from "../hooks/useBudget";
import ExpenseDetail from "./ExpenseDetail";
import IncomeDetail from "./IncomeDetail";
import { Button } from "@nextui-org/react";
import { AnimatePresence } from "framer-motion";

export default function ExpenseList() {
  const { state, dispatch } = useBudget();

  // Filter data based on the current type and category
  const filteredData = useMemo(() => {
    if (state.currentType === "gastos") {
      return state.currentCategory === ""
        ? state.expenses
        : state.expenses.filter((expense) => expense.category === state.currentCategory);
    }
    return [];
  }, [state.currentType, state.currentCategory, state.expenses, state.addPlusBudget]);
  
  const incomeData = useMemo(() => {
    if (state.currentType === "ingresos") {
      return state.addPlusBudget;
    }
    return [];
  }, [state.currentType, state.addPlusBudget]);

  const handleTypeChange = (type: "ingresos" | "gastos") => {
    dispatch({ type: "set-current-type", payload: { currentType: type } });
    dispatch({ type: "add-filter-category", payload: { id: "" } }); // Restart the filter
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-around">
        <Button
          onPress={() => handleTypeChange("gastos")}
          className={`text-lg md:text-2xl font-bold my-5 cursor-pointer transition-colors px-3 py-6 rounded-lg text-white
            ${state.currentType === "gastos" ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-400"}`}
        >
          Listado de Gastos
        </Button>
        <Button
          onPress={() => handleTypeChange("ingresos")}
          className={`text-lg md:text-2xl font-bold my-5 cursor-pointer transition-colors px-3 py-6 rounded-lg text-white
            ${state.currentType === "ingresos" ? "bg-green-600 hover:bg-green-500" : "bg-green-400"}`}
        >
          Listado de Ingresos
        </Button>
      </div>
      {filteredData.length === 0 && incomeData.length === 0 ? (
        <p className="text-gray-600 text-2xl font-bold text-center">No hay datos</p>
      ) : state.currentType === "gastos" ? (
        // Render the expenses
        <AnimatePresence>
          {filteredData.map((item, index) => (
            <ExpenseDetail
              key={item.id || `item-${index}`}
              expense={item}
            />
          ))}
        </AnimatePresence>
      ) : (
        // Render the incomes
        <AnimatePresence>
          {incomeData.map((item, index) => (
            <IncomeDetail
              key={item.id || `item-${index}`}
              income={item}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
