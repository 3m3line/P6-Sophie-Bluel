//variables appelées
const gallery = document.querySelector('.gallery');
const portfolio = document.getElementById('portfolio');
const h2Portfolio = document.querySelector('#portfolio h2');

// code pour gallery
async function fetchWork() {
    try{
        const response = await fetch ("http://localhost:5678/api/works");
        const data = await response.json();
        return data;
    }catch (error){
        console.error ('une erreur s\'est produite pendant la récupération des données')
            return [];}
};

async function createGallery() {
    try {
        const data = await fetchWork();
        data.forEach(work => {
            const workElement = document.createElement('figure');
            gallery.appendChild(workElement);
            workElement.innerHTML = `
                <img src='${work.imageUrl}' alt='${work.title}' />
                <h3>${work.title}</h3>`;
        });
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la création de la galerie', error);
    }
}
createGallery();

// filtres
async function fetchCategory() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('une erreur s\'est produite pendant la récupération des données', error);
        return [];
    }
}

function createFilterButtons(categories) {
    const filterWorkParent = document.createElement('div');
    filterWorkParent.classList.add('filter');
    portfolio.appendChild(filterWorkParent);
    h2Portfolio.insertAdjacentElement('afterend',filterWorkParent );

    //bouton "Tous"
    const ButtonTous = document.createElement('button');
    ButtonTous.textContent = "Tous";
    ButtonTous.classList.add('filter-button');
    ButtonTous.dataset.filter = "all"; 
    filterWorkParent.appendChild(ButtonTous);

    //autres boutons
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.classList.add('filter-button');
        button.dataset.filter = category.name.toLowerCase();
        filterWorkParent.appendChild(button);
    });

    return filterWorkParent;
}

async function Filtering() {
    try {
        const categories = await fetchCategory();
        const filterWorkParent = createFilterButtons(categories);
        const worksData = await fetchWork ();

        filterWorkParent.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener("click", clickButton);
        });

        function clickButton() {
            const filterValue = this.dataset.filter;

            // Filtrer les travaux en fonction de la catégorie sélectionnée
            let filteredWorks;
            if (filterValue === "all") {
                filteredWorks = worksData; 
            } else {
                filteredWorks = worksData.filter(work => {
                    return work.category.name.toLowerCase() === filterValue;
                });
            }

            // Effacer les images actuelles de la galerie
            gallery.innerHTML = '';

            // Afficher les travaux filtrés
            filteredWorks.forEach(work => {
                const workElement = document.createElement('figure');
                gallery.appendChild(workElement);
                workElement.innerHTML = `
                    <img src='${work.imageUrl}' alt='${work.title}' />
                    <h3>${work.title}</h3>`;
            });
        }
    } catch (error) {
        console.error('une erreur s\'est produite pendant la récupération des données', error);
    }
}

Filtering();