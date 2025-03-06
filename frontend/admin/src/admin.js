const API_URL = 'http://localhost:3000/api/cursos';
const form = document.getElementById('courseForm');
const tableBody = document.getElementById('adminTable');
let editingCourseId = null;

// Função para formatar a data para o formato dia/mês/ano
function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

// Função para carregar os cursos na tabela
async function loadCourses() {
    try {
        const response = await fetch(API_URL);
        const courses = await response.json();

        tableBody.innerHTML = '';
        
        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.codigo || '-'}</td>
                <td>${course.sigla || '-'}</td>
                <td>${course.nome || '-'}</td>
                <td>${course.unidade || '-'}</td>
                <td>${course.inicio ? formatDate(course.inicio) : '-'}</td>
                <td>${course.final ? formatDate(course.final) : '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editCourse(${course.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.id})">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
    }
}

// Função para adicionar ou editar um curso
async function saveCourse(event) {
    event.preventDefault();

    const courseData = {
        codigo: document.getElementById('codigo').value,
        sigla: document.getElementById('sigla').value,
        nome: document.getElementById('nome').value,
        unidade: document.getElementById('unidade').value,
        inicio: document.getElementById('inicio').value.split('/').reverse().join('-'), // Formata para YYYY-MM-DD
        final: document.getElementById('final').value.split('/').reverse().join('-') // Formata para YYYY-MM-DD
    };

    try {
        if (editingCourseId) {
            await fetch(`${API_URL}/${editingCourseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData)
            });
            editingCourseId = null;
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData)
            });
        }

        form.reset();
        loadCourses();
    } catch (error) {
        console.error('Erro ao salvar curso:', error);
    }
}

// Função para preencher o formulário com os dados de um curso para edição
async function editCourse(id) {
    try {
        const response = await fetch(`${API_URL}`);
        const courses = await response.json();
        const course = courses.find(c => c.id === id);

        if (course) {
            document.getElementById('codigo').value = course.codigo;
            document.getElementById('sigla').value = course.sigla;
            document.getElementById('nome').value = course.nome;
            document.getElementById('unidade').value = course.unidade;
            document.getElementById('inicio').value = formatDate(course.inicio); // Exibe no formato dia/mês/ano
            document.getElementById('final').value = formatDate(course.final); // Exibe no formato dia/mês/ano
            
            editingCourseId = id;
        }
    } catch (error) {
        console.error('Erro ao editar curso:', error);
    }
}

// Função para excluir um curso
async function deleteCourse(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadCourses();
    } catch (error) {
        console.error('Erro ao excluir curso:', error);
    }
}


function renderCourses(courses) {
    tableBody.innerHTML = '';
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.codigo || '-'}</td>
            <td>${course.sigla || '-'}</td>
            <td>${course.nome || '-'}</td>
            <td>${course.unidade || '-'}</td>
            <td>${course.inicio ? formatDate(course.inicio) : '-'}</td>
            <td>${course.final ? formatDate(course.final) : '-'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editCourse(${course.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.id})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}




// Event Listener para o formulário
form.addEventListener('submit', saveCourse);

// Carregar os cursos ao iniciar a página
loadCourses();
