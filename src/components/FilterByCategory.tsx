import { Select, SelectItem } from "@nextui-org/react";
import { categories } from '../data/categories';
import { useBudget } from "../hooks/useBudget"

export default function FilterByCategory() {
    const { dispatch, state } = useBudget();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: "add-filter-category", payload: { id: e.target.value } })
    }

    return (
        <div className="bg-white flex-1 shadow-lg p-4 mb-6 w-full border-b border-gray-200 flex gap-5 items-center">
            <p className="text-gray-800 text-sm md:text-lg font-bold">Filtrar por categoría</p>

            <Select
                id="category"
                name="category"
                label="Selecciona una categoría"
                value={state.currentCategory}
                defaultSelectedKeys={[""]}
                onChange={handleChange}
                className="flex-1"
            >
                {categories
                    .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
                        </SelectItem>
                    ))}
            </Select>
        </div>
    )
}
