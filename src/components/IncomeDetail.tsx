import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions } from 'react-swipeable-list';
import { formatDate } from '../helpers';
import { addBudget } from '../types/index';
import AmountDisplay from './AmountDisplay';
import 'react-swipeable-list/dist/styles.css';
import { useBudget } from '../hooks/useBudget';

type IncomeDetailProps = {
  income: addBudget
}

export default function IncomeDetail({ income }: IncomeDetailProps) {
  const { dispatch } = useBudget();

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={() => dispatch({ type: 'get-income-by-id', payload: { id: income.id } })}>
        Actualizar
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        // Eliminate a expense from the list and update the state
        onClick={() => dispatch({ type: 'delete-income', payload: { id: income.id } })}
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
        <div className='bg-white hover:scale-105 transition-all shadow-2xl px-5 py-10 sm:p-10 w-full flex gap-5 items-center'>
          <div>
            <img
              src={`/icono_ingresos.svg`}
              alt={income.name}
              className='w-20'
            />
          </div>

          <div className='flex-1 space-y-1'>
            <p className='text-xs sm:text-sm font-bold uppercase text-slate-500'>Ingresos</p>
            <p className="text-gray-800 uppercase sm:text-lg font-bold">{income.name}</p>
            <p className="text-slate-600 text-xs sm:text-sm">
              {income.date ? formatDate(income.date.toString()) : 'Fecha inválida'}
            </p>
          </div>
          <AmountDisplay
            amount={income.budget}
          />
        </div>
      </SwipeableListItem>
    </SwipeableList>
  )
}
