import { DateValue } from "@internationalized/date";

export type Expense = {
    id: string,
    expenseName: string,
    amount: number,
    category: string,
    date: DateValue | null
}

export type DraftExpense = Omit<Expense, 'id'>

// type ValuePiece = DateValue | null;
// export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type Category = {
    id: string,
    name: string,
    icon: string
}

export type addBudget = {
    id: string,
    name: string,
    budget: number,
    date: DateValue | null
}

export type DraftBudget = Omit<addBudget, 'id'>
