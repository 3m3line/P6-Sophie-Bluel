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

//connexion
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('MTP').value;

    // Prepare la data qui va être envoyée
    const loginData = {
        email: email,
        password: password
    };

    // Envoi le POST request à l'API
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            document.getElementById('message').textContent = 'Connexion réussie !';
            document.getElementById('message').style.color = 'green';
            // Here you can handle the successful login, e.g., redirect to another page
        } else {
            document.getElementById('message').textContent = 'L\'email ou le mot de passe est invalide';
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('message').textContent = 'Une erreur a eu lieu, merci d\'essayer de nouveau';
    });
});