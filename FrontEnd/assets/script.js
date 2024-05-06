const gallery = document.querySelector('.gallery');

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
                <h3>${work.title}</h3>
                <img src='${work.imageUrl}' alt='${work.title}' />`;
    });
    }catch (error){console.error ('une erreur s\'est produite pendant la récupération des données')}
}
