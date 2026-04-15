export const formatarDataHora = (valor) => {
    if (!valor) return "—"
    return new Date(valor).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}

export const toUTC = (localDateTime) => {
    const date = new Date(localDateTime)
    return date.toISOString()
}