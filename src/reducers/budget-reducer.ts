import { v4 as uuidv4 } from "uuid"
import { addBudget, Category, DraftBudget, DraftExpense, Expense } from "../types"
import { parseDate } from "@internationalized/date"

export type BudgetActions =
    { type: "add-budget", payload: { budget: number } } |
    { type: "open-modal" } |
    { type: "close-modal" } |
    { type: "add-expense", payload: { expense: DraftExpense } } |
    { type: "delete-expense", payload: { id: Expense['id'] } } |
    { type: "get-expense-by-id", payload: { id: Expense['id'] } } |
    { type: "get-income-by-id", payload: { id: addBudget['id'] } } |
    { type: "update-expense", payload: { expense: Expense } } |
    { type: "reset-app" } |
    { type: "add-filter-category", payload: { id: Category['id'] } } |
    { type: "add-plus-budget", payload: { budget: DraftBudget } } |
    { type: "set-current-type", payload: { currentType: "gastos" | "ingresos" } } |
    { type: "delete-income", payload: { id: addBudget['id'] } } |
    { type: "update-income", payload: { income: addBudget } }

export type BudgetState = {
    budget: number,
    modal: boolean,
    expenses: Expense[],
    editingId: Expense["id"],
    editingIncomeId: addBudget["id"],
    currentCategory: Category["id"],
    addPlusBudget: addBudget[],
    currentType: "gastos" | "ingresos"
}
// localstorage
const initialBudget = (): number => {
    const localStorageBudget = localStorage.getItem('budget')

    return localStorageBudget ? JSON.parse(localStorageBudget) : 0
}

const localStorageExpenses = (): Expense[] => {
    const localStorageExpenses = localStorage.getItem('expenses');
    return localStorageExpenses
        ? JSON.parse(localStorageExpenses).map((expense: any) => ({
            ...expense,
            date: expense.date && isValidISODate(expense.date) ? parseDate(expense.date) : null
        }))
        : [];
};

const localStorageIncomes = (): addBudget[] => {
    const localStorageAddPlusBudget = localStorage.getItem('income');
    return localStorageAddPlusBudget
        ? JSON.parse(localStorageAddPlusBudget).map((income: any) => ({
            ...income,
            date: income.date && isValidISODate(income.date) ? parseDate(income.date) : null
        }))
        : []
};

const isValidISODate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};


export const initialState: BudgetState = {
    budget: initialBudget(),
    modal: false,
    expenses: localStorageExpenses(),
    editingId: "",
    editingIncomeId: "",
    currentCategory: "",
    addPlusBudget: localStorageIncomes(),
    currentType: "gastos"
}

const createExpense = (drafExpense: DraftExpense): Expense => {
    return {
        ...drafExpense,
        id: uuidv4(),
        date: drafExpense.date
    }
}

const createAddBudget = (drafBudget: DraftBudget): addBudget => {
    return {
        ...drafBudget,
        id: uuidv4(),
    }
}

export const budgetReducer = ((
    state: BudgetState = initialState,
    action: BudgetActions
) => {
    if (action.type === "add-budget") {

        return {
            ...state,
            budget: action.payload.budget
        }
    }

    if (action.type === "open-modal") {
        return {
            ...state,
            modal: true
        }
    }
    if (action.type === "close-modal") {
        return {
            ...state,
            modal: false,
            editingId: "",
            editingIncomeId: ""
        }
    }
    if (action.type === "add-expense") {
        const expense = createExpense(action.payload.expense)

        return {
            ...state,
            expenses: [...state.expenses, expense],

        }
    }
    if (action.type === "delete-expense") {
        return {
            ...state,
            expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
        }
    }

    if (action.type === "get-expense-by-id") {
        return {
            ...state,
            editingId: action.payload.id,
            modal: true
        }
    }

    if (action.type === "get-income-by-id") {
        return {
            ...state,
            editingIncomeId: action.payload.id,
            modal: true
        }
    }

    if (action.type === "update-expense") {
        return {
            ...state,
            expenses: state.expenses.map(expense => {
                if (expense.id === action.payload.expense.id) {
                    return action.payload.expense
                }
                return expense
            }),
            editingId: "",
            modal: false
        }
    }
    if (action.type === "reset-app") {
        return {
            ...state,
            budget: 0,
            expenses: [],
            addPlusBudget: [],
        }
    }
    if (action.type === "add-filter-category") {
        return {
            ...state,
            currentCategory: action.payload.id
        }
    }
    if (action.type === "add-plus-budget") {
        const income = createAddBudget(action.payload.budget)

        return {
            ...state,
            addPlusBudget: [...state.addPlusBudget, income],
            budget: state.budget + income.budget
        }
    }

    if (action.type === "delete-income") {
        const incomeToDelete = state.addPlusBudget.find(income => income.id === action.payload.id);
        if (!incomeToDelete) return state;
        return {
            ...state,
            addPlusBudget: state.addPlusBudget.filter(income => income.id !== action.payload.id),
            budget: state.budget - incomeToDelete.budget

        }
    }

    if (action.type === "update-income") {
        const incomeToUpdate = state.addPlusBudget.find(income => income.id === action.payload.income.id);
        if (!incomeToUpdate) return state;

        const amountDifference = action.payload.income.budget - incomeToUpdate.budget;

        return {
            ...state,
            addPlusBudget: state.addPlusBudget.map(income => {
                if (income.id === action.payload.income.id) {
                    return action.payload.income;
                }
                return income;
            }),
            budget: state.budget + amountDifference,
            editingIncomeId: "",
            modal: false
        };
    }

    if (action.type === "set-current-type") {
        return {
            ...state,
            currentType: action.payload.currentType
        }
    }

    return state
})