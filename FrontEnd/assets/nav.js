//effet nav actif _ chargement page
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll("#header-nav ul li a");
    const currentURL = new URL(window.location.href);

    navLinks.forEach(function(link) {
        const linkURL = new URL(link.href); 

        // Vérifier si le texte du lien est différent de "login" ou "logout"
        if (link.textContent !== "logout") {
            if (linkURL.pathname === currentURL.pathname && linkURL.hash === currentURL.hash) {
                link.parentElement.classList.add("active");
            } else {
                link.parentElement.classList.remove("active");
            }
        }
    });  
});

//effet nav actif _ click sur nav
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll("#header-nav ul li a");

    navLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            navLinks.forEach(function(link) {
                if (link === event.target && link.textContent == "logout" && link.textContent =="login") {
                    link.parentElement.classList.add("active");
                } else {
                    link.parentElement.classList.remove("active");
                }
            });
        });
    });
});