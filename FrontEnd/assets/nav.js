//effet nav actif
/*document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll("#header-nav ul li a");
    const currentURL = new URL(window.location.href); // Utilisez l'URL complète actuelle 

    navLinks.forEach(function(link) {
        const linkURL = new URL(link.href); // Utilisez l'URL complète du lien

        // Comparez les chemins d'accès et les ancres
        if (linkURL.pathname === currentURL.pathname && linkURL.hash === currentURL.hash) {
            link.parentElement.classList.add("active");
        } else {
            link.parentElement.classList.remove("active");
        }
    });  
});*/

document.addEventListener("DOMContentLoaded", function() {
    const updateActiveLinks = function() {
        const navLinks = document.querySelectorAll("#header-nav ul li a");
        const currentURL = new URL(window.location.href); // Utilisez l'URL complète actuelle 

        navLinks.forEach(function(link) {
            const linkURL = new URL(link.href); // Utilisez l'URL complète du lien

            // Comparez les chemins d'accès et les ancres
            if (linkURL.pathname === currentURL.pathname && linkURL.hash === currentURL.hash) {
                link.parentElement.classList.add("active");
            } else {
                link.parentElement.classList.remove("active");
            }
        });  
    };

    // Mettre à jour les classes actives lorsque le DOM est chargé
    updateActiveLinks();

    // Mettre à jour les classes actives lorsqu'un lien est cliqué (sans recharger la page)
    const navLinks = document.querySelectorAll("#header-nav ul li a");
    navLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            const currentURL = new URL(window.location.href); // Déplacer la déclaration ici

            // Mettre à jour les classes actives pour tous les liens
            updateActiveLinks();
            
            // Mettre à jour la classe active pour le lien cliqué
            const clickedLinkURL = new URL(link.href);
            if (clickedLinkURL.pathname === currentURL.pathname && clickedLinkURL.hash === currentURL.hash) {
                link.parentElement.classList.add("active");
            } else {
                link.parentElement.classList.remove("active");
            }
        });
    });
});