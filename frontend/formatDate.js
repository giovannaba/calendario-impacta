function formatDate(dateString) {
    if (!dateString) return '-';

    // Verifica se a string contém "T", indicando um formato ISO
    if (dateString.includes('T')) {
        const date = new Date(dateString);
        if (isNaN(date)) return dateString; // Se não for uma data válida, retorna a string original

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() retorna de 0 a 11
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    }

    // Se o formato estiver como "01/01/2025", apenas reorganiza
    const parts = dateString.split('/');
    if (parts.length === 3) {
        return `${parts[0]}/${parts[1]}/${parts[2]}`; // Já está correto
    }

    return dateString; // Retorna como está se não for possível formatar
}