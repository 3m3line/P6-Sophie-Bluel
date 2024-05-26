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
            navConnexion.href = "./connexion.html";
            navConnexion.removeEventListener('click', Edit);
        })

    } else {
    // L'utilisateur n'est pas authentifié, masquer les éléments d'édition
        document.getElementById('filter').style.display = 'block'
        document.getElementById('editSection').style.display = 'none';
        navConnexion.textContent = "login";
        // navConnexion.href = "./connexion.html";
        navConnexion.removeEventListener('click', Edit);
        navConnexion.addEventListener('click', function(event){
            window.location.href = "./connexion.html"
        })
    }
};

Edit ();

////MODALE
///modale galerie photo
async function fetchSupWork() {
    try{
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (response.ok) {
            console.log(`L'œuvre avec l'identifiant ${workId} a été supprimée avec succès.`);
            return true;
        } else {
            console.error('La suppression de l\'œuvre a échoué.');
            return false; 
        }
    } catch (error) {
        console.error('Une erreur s\'est produite pendant la suppression de l\'œuvre.', error);
        return false; 
    }
};

async function galleryModaleFetch (){
    const ModaleFetch = await fetchWork ();
    const galleryModale = document.getElementById('galleryModale');
    ModaleFetch.forEach(work => {
        const galleryModaleElement = document.createElement('figure');
        galleryModale.appendChild(galleryModaleElement);
        galleryModaleElement.innerHTML = `
                <img src='${work.imageUrl}' alt='${work.title}' class='galleryimage'/>
                <img src='./assets/icons/poubelle.png' alt ='poubelle' class='gallerypoubelle'/>`;
        
        galleryModale.addEventListener('click', async function(event) {
            if (event.target.classList.contains('gallerypoubelle')) {
                const workId = work.id;
                const deletedWork = await fetchSupWork(workId);
                if (deletedWork) {
                    // Supprimer l'élément de la galerie si la suppression est réussie
                    galleryModaleElement.remove();
                }
            }
        });
    });
    
}
galleryModaleFetch ()

function createGalleryModale (event) {
    event.preventDefault();
    const modaleEdit = document.getElementById('modaleEdit');
    const exitModale = document.getElementById('exitModale');
    const formulaireModale = document.getElementById('formulaireModale');
    const galleryModale = document.getElementById('galleryModale');
    const returnArrowModale = document.getElementById('returnArrowModale');
    const messageModale = document.getElementById('messageModale');
    const imageInput = document.getElementById('imageInput');

    modaleEdit.style.display = "flex";
    formulaireModale.style.display = "none";
    galleryModale.style.display = "grid";
    messageModale.textContent="";
    
    //flèche retour
    returnArrowModale.style.display = "none";
    const headerModale = document.getElementsByClassName('headerModale')[0];
    headerModale.style.width = '';

    //fermeture modale
    exitModale.addEventListener('click', function(){
        modaleEdit.style.display = "none";
        document.getElementById('categorie').selectedIndex = 0;
        document.getElementById('titre').value="";
        history.replaceState(null, null, 'index.html');
        messageModale.textContent="";
        buttonModaleValider.removeEventListener('click', SentNewProjetModale);
        document.getElementById('imagePreview').innerHTML = "";
        imageInput.value = "";
        imageInput.removeEventListener('change', loadingPreviewImage);
        document.getElementById('iconeImageModale').style.display="block";
        document.getElementById('imageButtonInput').style.display="block";
        document.getElementById('infoImageModale').style.display="block";
        
    });

    //titre
    const titreModale = document.getElementsByClassName('titreModale')[0];
    titreModale.textContent="Galerie Photo";
    
    //bouton
    const buttonModale = document.getElementById('buttonModale');
    buttonModale.classList.remove('buttonModaleInactif');
    buttonModale.classList.add('buttonModale');
    buttonModale.textContent="Ajouter une photo";
}

document.getElementById('editSection').addEventListener('click', createGalleryModale);

//suppression Travaux
document.getElementById('gallerypoubelle')

///modale ajout photo

async function createCategoryModale () {
    const fetchCategoryModale = await fetchCategory();
    const CategoryModale = document.getElementById('categorie');
    fetchCategoryModale.forEach(category => {
        const CategoryModaleElement = document.createElement("option")
        CategoryModaleElement.value= category.name;
        CategoryModaleElement.text = category.name;
        CategoryModaleElement.id = category.id;
        CategoryModale.appendChild(CategoryModaleElement);
    })
}
createCategoryModale ()

function FormModaleValid() {
    const imageModale = document.getElementById('imageInput').value;
    const titreInput = document.getElementById('titre').value;
    const categorie = document.getElementById('categorie').value;
    if (!imageModale || !titreInput || !categorie) {
         return false;
     }
    return true;
}

function loadingPreviewImage() {
    const imagePreview = document.getElementById('imagePreview');
    const infoImageModale = document.getElementById('infoImageModale');
    const iconeImageModale = document.getElementById('iconeImageModale');
    const imageButtonPreview = document.getElementById('imageButtonInput');

    if (this.files && this.files[0]) {
        const reader = new FileReader();

        // création preview après chargement image
        reader.onload = function(e) {
            
            const img = document.createElement('img');
            img.src = e.target.result;

            imageButtonPreview.style.display = 'none';
            infoImageModale.style.display = 'none';
            iconeImageModale.style.display = 'none';

            imagePreview.appendChild(img);
            imagePreview.style.display = 'flex';
        };
    

        // Lire le contenu du fichier en tant qu'URL de données
        reader.readAsDataURL(this.files[0]);
    }
};

function createAjoutPhotoModale (event){
    event.preventDefault();
    const modaleEdit = document.getElementById('modaleEdit');
    const exitModale = document.getElementById('exitModale');
    const galleryModale = document.getElementById('galleryModale');
    const formulaireModale = document.getElementById('formulaireModale');
    const returnArrowModale = document.getElementById('returnArrowModale');
    const imageInput = document.getElementById('imageInput');
    const imageButtonInput = document.getElementById('imageButtonInput');

    modaleEdit.style.display = "flex";
    galleryModale.style.display = "none";
    formulaireModale.style.display = "flex";

    //flèche retour
    returnArrowModale.style.display = "block";
    const headerModale = document.getElementsByClassName('headerModale')[0];
    headerModale.style.width = "100%";

    //changement titre
    const titreModale = document.getElementsByClassName('titreModale')[0];
    titreModale.textContent="Ajout photo";

    //chargement image
    imageButtonInput.addEventListener('click', function(event) {
        imageInput.click();
        event.preventDefault();
    });

    //bouton non actif
    const buttonModale = document.getElementById('buttonModale');
    buttonModale.classList.remove('buttonModale');
    buttonModale.classList.add('buttonModaleInactif');
    buttonModale.textContent="Valider";
    const validateButtonState = () => {
        if (FormModaleValid()) {
            buttonModale.classList.remove('buttonModaleInactif');
            buttonModale.classList.add('buttonModale');
            buttonModale.classList.add('sentForm');
        } else {
            buttonModale.classList.remove('buttonModale');
            buttonModale.classList.add('buttonModaleInactif');
            buttonModale.classList.remove('sentForm');
        }
    };

    //suivi changement formulaire
    imageInput.addEventListener('change', function() {
        loadingPreviewImage.call(this);
        validateButtonState();
        console.log('La valeur de l\'entrée a été modifiée:', this.value);
    });
    
    document.getElementById('titre').addEventListener('input', function() {
        validateButtonState();
        console.log('La valeur du titre a changé pour:', this.value);
    });
    
    document.getElementById('categorie').addEventListener('change', function() {
        validateButtonState();
        console.log('La catégorie a changé pour:', this.value);
    });

    //envoi formulaire
    buttonModaleValider.addEventListener('click', SentNewProjetModale);
}

document.getElementById('buttonModale').addEventListener('click', function(event){
    createAjoutPhotoModale (event) ;
    event.preventDefault();
});

document.getElementById('returnArrowModale').addEventListener('click', function(event){
    createGalleryModale (event) ;
    event.preventDefault();
});

//Envoi nouveaux travaux
const buttonModaleValider = document.getElementById('buttonModale');

async function SentNewProjetModale (event) {
    if (buttonModaleValider.classList.contains('sentForm')){
        event.preventDefault();

        const imageInput = document.getElementById('imageInput').files[0];
        const title = document.getElementById('titre').value;
        const category = document.getElementById('categorie').value;
        
        const formData = new FormData();
        formData.append('image', imageInput);
        formData.append('title', title);
        formData.append('category', category);

        // Requête pour envoyer les données au serveur
        const token = sessionStorage.getItem('authToken');

        try{
            const response = await fetch ("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                //accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            });

            if(response.ok){
                const responseData = await response.json();
                console.log(responseData);
                console.log('Data sent successfully!');
            } else {
                // errors
                const errorMessage = await response.text();
                document.getElementById('messageModale').textContent = 'Une erreur est survenue lors de l\'envoi des données.';
                console.error('Status:', response.status);
                console.error('Response:', errorMessage);
            }
        }
        catch(error) {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('message').textContent = 'Une erreur a eu lieu, merci d\'essayer de nouveau';
        }
        
    }
};



