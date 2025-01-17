import { useSpring, LazyMotion, domAnimation } from 'motion/react';
import { formatCurrency } from '../helpers/index';
import { useEffect, useState } from 'react';

type AmountDisplayProps = {
    label?: string;
    amount: number;
}

export default function AmountDisplay({ label, amount }: AmountDisplayProps) {

    const [amountTransition, setAmountTransition] = useState(0);
    const springAmount = useSpring(0, {
        bounce: 0,
        duration: 1000,
    });

    springAmount.on('change', (springAmount) => {
        setAmountTransition(springAmount)
    })

    useEffect(() => {
        springAmount.set(amount)
    }, [amount])

    return (
        <LazyMotion features={domAnimation}>
            <p className="text-2xl text-blue-600 font-bold">
                {label && `${label}: `}
                <span className="font-black text-black">{formatCurrency(amountTransition)}</span>
            </p>
        </LazyMotion>
    );
}
