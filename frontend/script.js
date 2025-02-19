const API_URL = 'http://localhost:3000/api/cursos';
const searchInput = document.getElementById('searchInput');
const filterUnit = document.getElementById('filterUnit');
const tableBody = document.getElementById('courseTable');
let courses = []; // Armazena os cursos carregados

// Função para formatar a data para o formato dia/mês/ano
function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

// Função para carregar os cursos na tabela
async function loadCourses() {
    try {
        const response = await fetch(API_URL);
        courses = await response.json();

        populateUnitFilter();
        displayCourses(courses);
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
    }
}

// Função para preencher o filtro de unidade com opções únicas
function populateUnitFilter() {
    const units = [...new Set(courses.map(course => course.descricao))]; // Ajustado para usar a coluna correta
    filterUnit.innerHTML = '<option value="">Filtrar por Descrição</option>';
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        filterUnit.appendChild(option);
    });
}

// Função para exibir os cursos na tabela
function displayCourses(filteredCourses) {
    tableBody.innerHTML = '';
    filteredCourses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.codigo || '-'}</td>
            <td>${course.sigla || '-'}</td>
            <td>${course.nome || '-'}</td>
            <td>${course.unidade || '-'}</td>
            <td>${course.inicio ? formatDate(course.inicio) : '-'}</td>  <!-- Formatação da data de início -->
            <td>${course.final ? formatDate(course.final) : '-'}</td>    <!-- Formatação da data final -->
        `;
        tableBody.appendChild(row);
    });
}

// Barra de pesquisa
function filterCourses() {
    const searchText = searchInput.value.toLowerCase();
    const selectedUnit = filterUnit.value;

    const filtered = courses.filter(course => {
        const matchesSearch = course.id.toString().includes(searchText) ||
                              course.nome.toLowerCase().includes(searchText) || 
                              course.descricao.toLowerCase().includes(searchText);
        const matchesUnit = selectedUnit === '' || course.descricao === selectedUnit;

        return matchesSearch && matchesUnit;
    });

    displayCourses(filtered);
}

// Event Listeners para os filtros
searchInput.addEventListener('input', filterCourses);
filterUnit.addEventListener('change', filterCourses);

// Carregar os cursos ao iniciar a página
loadCourses();
