import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useBudget } from '../hooks/useBudget';
import AmountDisplay from './AmountDisplay';
import { useMemo } from 'react';
import { Button } from '@nextui-org/react';

export default function BudgetTracker() {
    const { dispatch } = useBudget()
    const { state, totalExpenses, remaining } = useBudget()

    const valuePercentage = useMemo(() => Math.round(+(totalExpenses / state.budget) * 100), [totalExpenses, state.expenses, state.addPlusBudget])
                
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex justify-center">
                <CircularProgressbar
                    value={valuePercentage}
                    text={`${valuePercentage}% Gastado`}
                    styles={buildStyles({
                        textSize: '10px',
                        pathColor: `${valuePercentage === 100 ? '#dc2626' : valuePercentage > 80 ? '#facc15' : '#3e98c7'}`,
                        textColor: `${valuePercentage === 100 ? '#dc2626' : '#3e98c7'}`,
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7'
                    })}
                />
            </div>

            <div className="flex flex-col justify-center items-center gap-8">
                <div className='flex flex-col w-full gap-2'>
                    <Button
                        type="button"
                        className="bg-pink-600 w-full p-2 text-white uppercase font-bold"
                        onPress={() => dispatch({ type: 'reset-app' })}
                    >
                        Resetear App
                    </Button>
                </div>

                <AmountDisplay
                    label="Presupuesto"
                    amount={state.budget}
                    
                />
                <AmountDisplay
                    label="Disponible"
                    amount={remaining}
                />
                <AmountDisplay
                    label="Gastado"
                    amount={totalExpenses}
                />
            </div>
        </div>
    )
}
