export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: string): string {
    const objDate = new Date(date);
    objDate.setMinutes(objDate.getMinutes() + objDate.getTimezoneOffset());

    if (isNaN(objDate.getTime())) {
        return "Fecha inválida"; 
    }

    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return objDate.toLocaleDateString("es-CO", options);
}

