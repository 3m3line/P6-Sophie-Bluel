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

//login
document.getElementById('loginForm').addEventListener('submit', async(event)=> {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('MTP').value;

    // Envoi le POST request à l'API
    try {
       const response = await fetch ("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email,password})
        });
        

        if (response.ok) {
                const data = await response.json();
                document.getElementById('message').textContent = 'Connexion réussie !';
                document.getElementById('message').style.color = '#1D6154';
                sessionStorage.setItem('authToken', data.token);
                window.location.href = "index.html";
        }

        //  else if (response.status === 401) {
        //      const data = await response.json();
        //      document.getElementById('message').textContent = 'Le mot de passe est invalide';
        //      document.getElementById('message').style.color = 'red';
        // }

        else {
            document.getElementById('message').textContent = 'L\'email ou le mot de passe est invalide';
            document.getElementById('message').style.color = 'red';
        }
    }
    
    catch(error) {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('message').textContent = 'Une erreur a eu lieu, merci d\'essayer de nouveau';
    };
});