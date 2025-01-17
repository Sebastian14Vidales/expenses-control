import { useMemo, useState } from "react"
import { useBudget } from "../hooks/useBudget";
import { Input } from "@nextui-org/react";

export default function BudgetForm() {

  const [budget, setBudget] = useState(0);
  const { dispatch } = useBudget()


  // function to catch the value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(+e.target.value);
  }

  // function to validate number
  const isValid = useMemo(() => {
    return isNaN(budget) || budget <= 0
  }, [budget])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch({ type: 'add-budget', payload: { budget } })
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-5">
          <label htmlFor="budget" className="uppercase text-4xl text-blue-600 font-bold text-center">
            Definir Presupuesto
          </label>
          <Input
            id="budget"
            type="number"
            size="md"
            className="w-full rounded p-2"
            placeholder="Define tu presupuesto"
            name="budget"
            value={budget.toFixed()}
            onChange={handleChange}
          />
        </div>
        <Input
          size="lg"
          type="submit"
          value='Ingresa tu Presupuesto'
          id="budget"
          className="disabled:opacity-40 w-full cursor-pointer p-2 font-black uppercase"
          name="budget"
          isDisabled={isValid}
          color="primary"
          style={{ backgroundColor: '#2563eb', fontWeight: "bold", textTransform: "uppercase", cursor: "pointer" }}
        />
      </form>
    </>

  )
}
