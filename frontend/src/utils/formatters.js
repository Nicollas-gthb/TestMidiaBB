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

// No seu arquivo de formatters.js ou utils.js

export const formatarParaInput = (dataISO) => {
    if (!dataISO) return "";
    const date = new Date(dataISO);
    
    // Extrai os componentes locais da data
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    const hora = String(date.getHours()).padStart(2, '0');
    const minuto = String(date.getMinutes()).padStart(2, '0');
    
    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

export const toUTC = (localDateTime) => {
    const date = new Date(localDateTime)
    return date.toISOString()
}