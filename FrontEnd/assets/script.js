//variables appelées
const gallery = document.querySelector('.gallery');
const portfolio = document.getElementById('portfolio');

// code pour gallery
async function fetchWork() {
    try{
        const response = await fetch ("http://localhost:5678/api/works");
        console.log(response.status);
        const data = await response.json()
        console.log("affichage data",data)
        data.forEach (work => {
            const workElement = document.createElement ('figure');
            gallery.appendChild(workElement);
            workElement.innerHTML = `
                <img src='${work.imageUrl}' alt='${work.title}' />
                <h3>${work.title}</h3>`;
    });
    }catch (error){console.error ('une erreur s\'est produite pendant la récupération des données')}
};
fetchWork();

// filtres
async function filter(){
    try{
        const response = await fetch ("http://localhost:5678/api/categories")
        console.log(response.status)
        const data = await response.json()
        console.log("affichage data",data)
        const filterWorkParent = document.createElement ('div');
        portfolio.appendChild(filterWorkParent);
        filterWorkParent.classList.add ('filter')
        portfolio.parentNode.insertBefore(filterWorkParent, gallery);
        Object.values(data).forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.classList.add('filter-button');
            filterWorkParent.appendChild(button);
            button.addEventListener("click", function() {
                const filterValue = this.dataset.filter;
                gallery.querySelectorAll('figure').forEach(figure => {
                    if (filterValue === 'all' || figure.classList.contains(filterValue)) {
                        figure.style.display = 'block';
                    } else {
                        figure.style.display = 'none';
                    }
                });
            });
        })
    }
    catch (error){console.error ('une erreur s\'est produite pendant la récupération des données')}
}
filter()
