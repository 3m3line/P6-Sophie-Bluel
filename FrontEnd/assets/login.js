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
                navConnexion.classList.remove("active");
                window.location.href = "index.html";
        }

        else {
            document.getElementById('message').textContent = 'Erreur dans l\’identifiant ou le mot de passe';
            document.getElementById('message').style.color = 'red';
        }
    }
    
    catch(error) {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('message').textContent = 'Une erreur a eu lieu, merci d\'essayer de nouveau';
    };
});