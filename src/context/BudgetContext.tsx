import { useReducer, createContext, useMemo, Dispatch, ReactNode } from "react"
import { budgetReducer, BudgetState, initialState, BudgetActions } from "../reducers/budget-reducer"

type BudgetContextProps = {
    state: BudgetState
    dispatch: Dispatch<BudgetActions>
    totalExpenses: number
    remaining: number
}

type BudgetProviderProps = {
    children: ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>(null!)

export const BudgetProvider = ({ children }: BudgetProviderProps) => {

    const [state, dispatch] = useReducer(budgetReducer, initialState)

    const totalExpenses = useMemo(() => state.expenses.reduce((acc, expense) => acc + expense.amount, 0), [state.expenses])
    const remaining = useMemo(() => state.budget - totalExpenses, [state.budget, totalExpenses])

    return (
        <BudgetContext.Provider
            value={{
                state,
                dispatch,
                totalExpenses,
                remaining
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}