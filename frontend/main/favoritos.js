const FAVORITES_API = 'http://localhost:3001/api/favoritos';
const showFavoritesBtn = document.getElementById('showFavoritesBtn');

function displayCourses(filteredCourses, isFavoriteView = false) {
    tableBody.innerHTML = '';

    filteredCourses.forEach(course => {
        const row = document.createElement('tr');

        const actionButton = isFavoriteView
            ? `<button class="btn btn-sm btn-danger" onclick="removeFavorite(${course.id})">Remover</button>`
            : `<button class="btn btn-sm btn-outline-primary" onclick="favoriteCourse(${course.id})">Favoritar</button>`;

        row.innerHTML = `
            <td>${course.codigo || '-'}</td>
            <td>${course.sigla || '-'}</td>
            <td>${course.nome || '-'}</td>
            <td>${course.unidade || '-'}</td>
            <td>${course.inicio ? formatDate(course.inicio) : '-'}</td>
            <td>${course.final ? formatDate(course.final) : '-'}</td>
            <td>${actionButton}</td>
        `;
        tableBody.appendChild(row);
    });

    // Exibe botão "Voltar" se for a tela de favoritos
    const backButton = document.getElementById('backBtn');
    if (backButton) backButton.style.display = isFavoriteView ? 'inline-block' : 'none';
}


async function favoriteCourse(id) {
    try {
        const response = await fetch(FAVORITES_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ curso_id: id })
        });

        if (response.ok) {
            alert('Curso adicionado aos favoritos!');
        } else {
            const data = await response.json();
            alert(data.error || 'Erro ao favoritar.');
        }
    } catch (error) {
        console.error('Erro ao favoritar curso:', error);
    }
}

showFavoritesBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(FAVORITES_API);
        const favorites = await response.json();
        displayCourses(favorites);
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
    }
});

async function removeFavorite(id) {
    try {
        const response = await fetch(`${FAVORITES_API}/${id}`, { method: 'DELETE' });

        if (response.ok) {
            alert('Curso removido dos favoritos!');
            showFavorites(); // Atualiza lista de favoritos
        } else {
            const data = await response.json();
            alert(data.error || 'Erro ao remover favorito.');
        }
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
    }
}

async function showFavorites() {
    try {
        const response = await fetch(FAVORITES_API);
        const favorites = await response.json();
        displayCourses(favorites, true);
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
    }
}

showFavoritesBtn.addEventListener('click', showFavorites);

const backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', () => displayCourses(courses));
