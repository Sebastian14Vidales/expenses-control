import { useMemo } from 'react';
import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions } from 'react-swipeable-list';
import { formatDate } from '../helpers';
import { Expense } from '../types/index';
import AmountDisplay from './AmountDisplay';
import { categories } from '../data/categories';
import 'react-swipeable-list/dist/styles.css';
import { useBudget } from '../hooks/useBudget';


type ExpenseDetailProps = {
  expense: Expense
}

export default function ExpenseDetail({ expense }: ExpenseDetailProps) {
  const { dispatch, state } = useBudget();
  const categoryInfo = useMemo(
    () => categories.find((category) => category.id === expense.category) || { icon: "default", name: "Sin categoría" },
    [expense]
  );

  const handleDelete = () => {
    if (state.currentType === "gastos") {
      dispatch({ type: 'delete-expense', payload: { id: expense.id } });
    } else if (state.currentType === "ingresos") {
      dispatch({ type: 'delete-income', payload: { id: expense.id } });
    }
  };

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={() => dispatch({ type: 'get-expense-by-id', payload: { id: expense.id } })}>
        Actualizar
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        // Eliminate a expense from the list and update the state
        onClick={handleDelete}
      >
        Eliminar
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableList>
      <SwipeableListItem
        maxSwipe={30}
        leadingActions={leadingActions()}
        trailingActions={trailingActions()}
      >
        <div className='bg-white hover:scale-105 transition-all shadow-2xl py-10 px-5 sm:p-10 w-full flex gap-5 items-center'>
          <div>
            <img
              src={`/icono_${categoryInfo.icon}.svg`}
              alt={categoryInfo.name}
              className='w-20'
            />
          </div>

          <div className='flex-1 space-y-1'>
            <p className='text-xs sm:text-sm font-bold uppercase text-slate-500'>{categoryInfo.name}</p>
            <p className="text-gray-800 uppercase sm:text-lg font-bold">{expense.expenseName}</p>
            <p className="text-slate-600 text-xs sm:text-sm">
              {expense.date ? formatDate(expense.date.toString()) : null}
            </p>
          </div>
          <AmountDisplay
            amount={expense.amount}
          />
        </div>
      </SwipeableListItem>
    </SwipeableList>
  )
}
