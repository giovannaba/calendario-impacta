const API_URL = 'http://localhost:3000/api/cursos';
const searchInput = document.getElementById('searchInput');
const filterUnit = document.getElementById('filterUnit');
const tableBody = document.getElementById('courseTable');
let courses = []; // Armazena os cursos carregados


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

// Função para preencher o filtro de unidade com opções únicas
function populateUnitFilter() {
    const units = [...new Set(courses.map(course => course.unidade))]; // Ajuste: se a coluna for "descricao", troque para course.descricao
    filterUnit.innerHTML = '<option value="">Filtrar por Unidade</option>';
    
    units.forEach(unit => {
        if (unit) { // Evita adicionar valores nulos ao filtro
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit;
            filterUnit.appendChild(option);
        }
    });
}

// Função para filtrar os cursos pela barra de pesquisa e pelo filtro de unidade
function filterCourses() {
    const searchText = searchInput.value.toLowerCase();
    const selectedUnit = filterUnit.value;

    const filtered = courses.filter(course => {
        const matchesSearch = 
            (course.codigo && course.codigo.toString().includes(searchText)) ||
            (course.sigla && course.sigla.toLowerCase().includes(searchText)) ||
            (course.nome && course.nome.toLowerCase().includes(searchText)) ||
            (course.unidade && course.unidade.toLowerCase().includes(searchText));

        const matchesUnit = selectedUnit === '' || course.unidade === selectedUnit;

        return matchesSearch && matchesUnit;
    });

    displayCourses(filtered);
}

// Event Listeners para os filtros
searchInput.addEventListener('input', filterCourses);
filterUnit.addEventListener('change', filterCourses);

// Carregar os cursos ao iniciar a página
loadCourses();
