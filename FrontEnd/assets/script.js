//effet nav actif
document.addEventListener("DOMContentLoaded", function() {
    const currentPathWithAnchor = window.location.pathname + window.location.hash; // Récupère le chemin d'accès de la page actuelle avec l'ancre

    const navLinks = document.querySelectorAll("#header-nav ul li a");

    navLinks.forEach(function(link) {
        const linkPathWithAnchor = new URL(link.href).pathname + new URL(link.href).hash; // Récupère le chemin d'accès du lien avec l'ancre

        if (linkPathWithAnchor === currentPathWithAnchor) {
            link.parentElement.classList.add("active");
        } else {
            link.parentElement.classList.remove("active");
        }
    });
});


//variables appelées
const gallery = document.querySelector('.gallery');
const portfolio = document.getElementById('portfolio');
const editSectionPortfolio = document.querySelector('.entete-portfolio');

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
    const filterWorkParent = document.getElementById('filter')

    //bouton "Tous"
    const ButtonTous = document.createElement('button');
    ButtonTous.textContent = "Tous";
    ButtonTous.classList.add('filter-button','active');
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
        const filterButtons = filterWorkParent.querySelectorAll('.filter-button');

        filterButtons.forEach(button => {
            button.addEventListener("click", function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filtrer les travaux en fonction de la catégorie sélectionnée
                const filterValue = this.dataset.filter;
                let filteredWorks;
                if (filterValue === "all") {
                    filteredWorks = worksData;
                } else {
                    filteredWorks = worksData.filter(work => {
                        return work.category.name.toLowerCase() === filterValue;
                    });
                };
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
            });
        });

    } catch (error) {
        console.error('une erreur s\'est produite pendant la récupération des données', error);
    }
}

Filtering();

//Edition après connexion et déconnexion

function Edit () {
    const navConnexion = document.getElementById('navConnexion');
    const token = sessionStorage.getItem('authToken');
    const tokenValid = !!token
    console.log (token, tokenValid)

    if (tokenValid) {
    // L'utilisateur est authentifié, afficher les éléments d'édition
        document.getElementById('filter').style.display = 'none';
        document.getElementById('editSection').style.display = 'flex';
        navConnexion.textContent = "logout";
        navConnexion.href = "#";

        // déconnexion au clic
        navConnexion.addEventListener('click', function(event){
            event.preventDefault()
            sessionStorage.clear();
            Edit();
            console.log ('event fonctionne')
        })

    } else {
    // L'utilisateur n'est pas authentifié, masquer les éléments d'édition
        document.getElementById('filter').style.display = 'block'
        document.getElementById('editSection').style.display = 'none';
        navConnexion.textContent = "login";
        navConnexion.href = "./connexion.html";
        navConnexion.removeEventListener('click', Edit);
    }
};

Edit ();

//modale
async function createModaleEdit () {
    const modaleEdit = document.getElementById('modaleEdit');
    modaleEdit.classList.add('modaleEdit');
    const contenantModale = document.createElement('div');
    contenantModale.classList.add('contenantModale');
    modaleEdit.appendChild(contenantModale);

    //header modale
    const headerModale = document.createElement('div');
    headerModale.classList.add('headerModale');
    contenantModale.appendChild(headerModale);
    const exitModale = document.createElement('img');
    exitModale.classList.add('exitModale');
    exitModale.src = './assets/icons/croix.png';
    exitModale.alt = 'Croix de fermeture';
    headerModale.appendChild(exitModale);

    //fermeture modale
    exitModale.addEventListener('click', function(){
        closeModale();
    });

    //titre
    const titreModale = document.createElement('h2');
    titreModale.classList.add('titreModale');
    titreModale.textContent="Galerie photo";
    contenantModale.appendChild(titreModale);

    //gallery
    const galleryModaleFetch = await fetchWork ();
    const galleryModale = document.createElement('div');
    galleryModale.classList.add('galleryModale');
    contenantModale.appendChild(galleryModale);
    galleryModaleFetch.forEach(work => {
        const galleryModaleElement = document.createElement('figure');
        galleryModale.appendChild(galleryModaleElement);
        galleryModaleElement.innerHTML = `
                <img src='${work.imageUrl}' alt='${work.title}' id='galleryimage'/>
                <img src='./assets/icons/poubelle.png' alt ='poubelle' id='gallerypoubelle'/>`
    });
    
    //barre séparation
    const barreModale = document.createElement('div');
    
    barreModale.classList.add('barreModale');
    contenantModale.appendChild(barreModale);

    //bouton ajouter une photo
    const buttonModale = document.createElement('button');
    buttonModale.textContent="Ajouter une photo";
    buttonModale.classList.add('buttonModale');
    contenantModale.appendChild(buttonModale);
}



document.getElementById('editSection').addEventListener('click', function(){
    createModaleEdit ()
})

function closeModale () {
    const contenantModale = document.getElementsByClassName('contenantModale')[0];
    while (contenantModale.firstChild) {
        contenantModale.removeChild(contenantModale.firstChild);
    }
    const modaleEdit = document.getElementById('modaleEdit');
    modaleEdit.classList.remove('modaleEdit');
}