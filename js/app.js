// Mise à jour du fichier app.js pour intégrer les illustrations des commandes et la documentation PDF

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const modelSelector = document.getElementById('model-selector');
    const helpButton = document.getElementById('help-button');
    const pdfSection = document.getElementById('pdf-section');
    const commandsGallery = document.getElementById('commands-gallery');
    
    // Base de connaissances
    let knowledgeBase = {};
    
    // Modèle de tracteur actuel
    let currentModel = "651-4";
    
    // Chargement de la base de connaissances
    fetch('data/knowledge_base_updated_2.json')
        .then(response => response.json())
        .then(data => {
            knowledgeBase = data;
            displayWelcomeMessage();
            updateCommandsGallery();
            updatePdfSection();
        })
        .catch(error => {
            console.error('Erreur lors du chargement de la base de connaissances:', error);
            chatMessages.innerHTML += `
                <div class="message bot-message">
                    <p>Erreur lors du chargement de la base de connaissances. Veuillez réessayer plus tard.</p>
                </div>
            `;
        });
    
    // Gestionnaires d'événements
    sendButton.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
    
    modelSelector.addEventListener('change', function() {
        currentModel = this.value;
        displayModelChangeMessage();
        updateCommandsGallery();
        updatePdfSection();
    });
    
    helpButton.addEventListener('click', displayHelpMessage);
    
    // Fonction pour gérer les messages de l'utilisateur
    function handleUserMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;
        
        // Afficher le message de l'utilisateur
        chatMessages.innerHTML += `
            <div class="message user-message">
                <p>${userMessage}</p>
            </div>
        `;
        
        // Vider l'input
        chatInput.value = '';
        
        // Faire défiler vers le bas
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Générer une réponse
        setTimeout(() => {
            const botResponse = generateResponse(userMessage);
            
            // Afficher la réponse du bot
            chatMessages.innerHTML += `
                <div class="message bot-message">
                    <p>${botResponse}</p>
                </div>
            `;
            
            // Faire défiler vers le bas
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    }
    
    // Fonction pour générer une réponse
    function generateResponse(userMessage) {
        const normalizedMessage = userMessage.toLowerCase();
        
        // Vérifier si le message concerne les commandes ou le poste de conduite
        if (normalizedMessage.includes('commande') || normalizedMessage.includes('poste de conduite') || normalizedMessage.includes('tableau de bord') || normalizedMessage.includes('levier')) {
            return generateCommandResponse(normalizedMessage);
        }
        
        // Vérifier si le message concerne la prise de force
        if (normalizedMessage.includes('prise de force') || normalizedMessage.includes('pdf') || normalizedMessage.includes('pto')) {
            return generatePriseDeForceResponse();
        }
        
        // Vérifier si le message concerne le différentiel
        if (normalizedMessage.includes('différentiel') || normalizedMessage.includes('blocage')) {
            return generateDifferentielResponse();
        }
        
        // Vérifier si le message concerne les vues éclatées
        if (normalizedMessage.includes('vue éclatée') || normalizedMessage.includes('schéma') || normalizedMessage.includes('pièces détachées')) {
            return generateVueEclateeResponse();
        }
        
        // Vérifier si le message concerne les manuels ou la documentation
        if (normalizedMessage.includes('manuel') || normalizedMessage.includes('documentation') || normalizedMessage.includes('guide')) {
            return generateDocumentationResponse();
        }
        
        // Réponse par défaut basée sur le modèle actuel
        return knowledgeBase[currentModel].general_response;
    }
    
    // Fonction pour générer une réponse concernant les commandes
    function generateCommandResponse(message) {
        const commandsInfo = knowledgeBase[currentModel].commands;
        let response = `<strong>Poste de commande du tracteur Renault ${currentModel}</strong><br><br>`;
        
        response += commandsInfo.description + "<br><br>";
        response += "Vous pouvez consulter les illustrations détaillées des commandes dans la section Galerie ci-dessous.<br><br>";
        
        // Ajouter des détails spécifiques sur les commandes principales
        response += "<strong>Commandes principales :</strong><br>";
        for (const command in commandsInfo.main_controls) {
            response += `- <strong>${command}</strong> : ${commandsInfo.main_controls[command]}<br>`;
        }
        
        return response;
    }
    
    // Fonction pour générer une réponse concernant la prise de force
    function generatePriseDeForceResponse() {
        const pdfInfo = knowledgeBase[currentModel].prise_de_force;
        let response = `<strong>Prise de force du tracteur Renault ${currentModel}</strong><br><br>`;
        
        response += pdfInfo.description + "<br><br>";
        response += "<strong>Caractéristiques techniques :</strong><br>";
        for (const spec in pdfInfo.specifications) {
            response += `- <strong>${spec}</strong> : ${pdfInfo.specifications[spec]}<br>`;
        }
        
        response += "<br><strong>Utilisation :</strong><br>";
        for (const step of pdfInfo.utilisation) {
            response += `- ${step}<br>`;
        }
        
        return response;
    }
    
    // Fonction pour générer une réponse concernant le différentiel
    function generateDifferentielResponse() {
        const diffInfo = knowledgeBase[currentModel].differentiel;
        let response = `<strong>Différentiel du tracteur Renault ${currentModel}</strong><br><br>`;
        
        response += diffInfo.description + "<br><br>";
        response += "<strong>Fonctionnement :</strong><br>" + diffInfo.fonctionnement + "<br><br>";
        
        response += "<strong>Procédure de blocage du différentiel :</strong><br>";
        for (const step of diffInfo.procedure_blocage) {
            response += `- ${step}<br>`;
        }
        
        response += "<br>Vous pouvez consulter le schéma du différentiel dans la section Galerie ci-dessous.";
        
        return response;
    }
    
    // Fonction pour générer une réponse concernant les vues éclatées
    function generateVueEclateeResponse() {
        let response = `<strong>Vues éclatées du tracteur Renault ${currentModel}</strong><br><br>`;
        
        response += "Les vues éclatées sont disponibles dans les manuels techniques que vous pouvez consulter dans la section Documentation PDF ci-dessous.<br><br>";
        
        if (currentModel === "651-4") {
            response += "Le manuel technique du Renault 651-4 contient des vues éclatées détaillées des composants suivants :<br>";
            response += "- Moteur MWM D227-4<br>";
            response += "- Transmission et boîte de vitesses<br>";
            response += "- Pont arrière et différentiel<br>";
            response += "- Système hydraulique et relevage<br>";
            response += "- Poste de commande<br>";
        } else {
            response += "Le manuel technique du Renault Super 7 contient des vues éclatées détaillées des composants suivants :<br>";
            response += "- Moteur Perkins P3 152<br>";
            response += "- Transmission et boîte de vitesses<br>";
            response += "- Pont arrière et différentiel<br>";
            response += "- Système hydraulique et relevage<br>";
            response += "- Poste de commande<br>";
        }
        
        return response;
    }
    
    // Fonction pour générer une réponse concernant la documentation
    function generateDocumentationResponse() {
        let response = `<strong>Documentation disponible pour le tracteur Renault ${currentModel}</strong><br><br>`;
        
        response += "Vous pouvez consulter les manuels techniques complets dans la section Documentation PDF ci-dessous.<br><br>";
        
        if (currentModel === "651-4") {
            response += "Documents disponibles pour le Renault 651-4 :<br>";
            response += "- Manuel technique complet (Revue Technique)<br>";
            response += "- Guide d'utilisation et d'entretien<br>";
            response += "- Catalogue de pièces détachées<br>";
        } else {
            response += "Documents disponibles pour le Renault Super 7 :<br>";
            response += "- Manuel de réparation R7054-R7055<br>";
            response += "- Guide d'utilisation et d'entretien<br>";
            response += "- Catalogue de pièces détachées<br>";
        }
        
        return response;
    }
    
    // Fonction pour afficher un message de bienvenue
    function displayWelcomeMessage() {
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <p>Bienvenue sur le chatbot des tracteurs Renault 651-4 et Super 7 ! Je peux vous fournir des informations détaillées sur ces deux modèles, notamment :</p>
                <ul>
                    <li>Les spécifications techniques</li>
                    <li>Le poste de commande et les différents leviers</li>
                    <li>Le fonctionnement du différentiel</li>
                    <li>L'utilisation de la prise de force</li>
                    <li>Des vues éclatées des composants</li>
                </ul>
                <p>Vous pouvez également consulter les illustrations des commandes dans la section Galerie et les manuels techniques complets dans la section Documentation PDF.</p>
                <p>Comment puis-je vous aider aujourd'hui ?</p>
            </div>
        `;
    }
    
    // Fonction pour afficher un message lors du changement de modèle
    function displayModelChangeMessage() {
        chatMessages.innerHTML += `
            <div class="message bot-message">
                <p>Vous consultez maintenant les informations du tracteur Renault ${currentModel}. Les sections Galerie et Documentation PDF ont été mises à jour en conséquence.</p>
                <p>Comment puis-je vous aider avec ce modèle ?</p>
            </div>
        `;
        
        // Faire défiler vers le bas
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Fonction pour afficher un message d'aide
    function displayHelpMessage() {
        chatMessages.innerHTML += `
            <div class="message bot-message">
                <p><strong>Aide à l'utilisation du chatbot</strong></p>
                <p>Voici quelques exemples de questions que vous pouvez poser :</p>
                <ul>
                    <li>"Décris-moi le poste de commande"</li>
                    <li>"Comment fonctionne le différentiel ?"</li>
                    <li>"Comment utiliser la prise de force ?"</li>
                    <li>"Montre-moi les vues éclatées"</li>
                    <li>"Où trouver la documentation technique ?"</li>
                </ul>
                <p>Vous pouvez également changer de modèle de tracteur en utilisant le sélecteur en haut de la page.</p>
            </div>
        `;
        
        // Faire défiler vers le bas
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Fonction pour mettre à jour la galerie des commandes
    function updateCommandsGallery() {
        commandsGallery.innerHTML = '';
        
        // Ajouter les images spécifiques au modèle actuel
        if (currentModel === "651-4") {
            commandsGallery.innerHTML += `
                <div class="gallery-item">
                    <h3>Vue générale du tracteur Renault 651-4</h3>
                    <img src="images/renault_651_4_tracteur.png" alt="Tracteur Renault 651-4">
                </div>
                <div class="gallery-item">
                    <h3>Poste de commande du Renault 651-4</h3>
                    <img src="images/poste_commande_renault_651.png" alt="Poste de commande Renault 651-4">
                    <p>1. Commutateur d'éclairage et avertisseur - 2. Prise de courant - 3. Tirette d'arrêt du moteur - 4. Commande des clignotants - 5. Cadran de contrôle - 6. Commande du signal de détresse - 7. Compte-tours et totalisateur d'heures - 8. Accélérateur à main - 9. Contacteur général à clé - 10. Levier de commande d'un distributeur auxiliaire - 11. Levier d'accouplement des pédales de frein - 12. Levier de changement de vitesses - 13. Pédale d'accélérateur - 14. Pédale d'embrayage - 15. Levier d'inverseur - 16. Débrayage de la prise de force - 17. Levier de sélection de gammes - 18. Pédale d'embrayage d'avancement - 19. Manette d'embrayage de prise de force - 20. Levier de frein à main - 21. Levier de blocage du différentiel - 22. Leviers de commande du relevage hydraulique</p>
                </div>
                <div class="gallery-item">
                    <h3>Schéma du différentiel</h3>
                    <img src="images/differentiel_schema.png" alt="Schéma du différentiel">
                    <p>Schéma détaillé du mécanisme de différentiel et de son système de blocage</p>
                </div>
            `;
        } else {
            commandsGallery.innerHTML += `
                <div class="gallery-item">
                    <h3>Vue générale du tracteur Renault Super 7</h3>
                    <img src="images/renault_super_7.jpeg" alt="Tracteur Renault Super 7">
                </div>
                <div class="gallery-item">
                    <h3>Poste de commande du Renault Super 7</h3>
                    <img src="images/commandes/poste_commande_super7.png" alt="Poste de commande Renault Super 7">
                    <p>1. Volant de direction - 2. Tableau de bord - 3. Levier de vitesses - 4. Levier de gammes - 5. Pédale d'embrayage - 6. Pédales de frein - 7. Pédale d'accélérateur - 8. Levier de frein à main - 9. Levier de blocage du différentiel - 10. Levier de commande du relevage hydraulique - 11. Levier d'embrayage de la prise de force - 12. Manette de réglage du débit hydraulique</p>
                </div>
                <div class="gallery-item">
                    <h3>Schéma du différentiel</h3>
                    <img src="images/differentiel_schema.png" alt="Schéma du différentiel">
                    <p>Schéma détaillé du mécanisme de différentiel et de son système de blocage</p>
                </div>
            `;
        }
    }
    
    // Fonction pour mettre à jour la section PDF
    function updatePdfSection() {
        pdfSection.innerHTML = '';
        
        // Ajouter les PDF spécifiques au modèle actuel
        if (currentModel === "651-4") {
            pdfSection.innerHTML += `
                <div class="pdf-item">
                    <h3>Manuel technique complet Renault 651-4</h3>
                    <p>Revue technique détaillée du tracteur Renault 651-4 avec toutes les spécifications, procédures d'entretien et vues éclatées.</p>
                    <a href="pdf/Renault_551_556_651_652_656.pdf" target="_blank" class="pdf-button">Consulter le PDF</a>
                </div>
            `;
        } else {
            pdfSection.innerHTML += `
                <div class="pdf-item">
                    <h3>Manuel de réparation Renault Super 7</h3>
                    <p>Manuel technique détaillé du tracteur Renault Super 7 (R7055) avec toutes les spécifications, procédures d'entretien et vues éclatées.</p>
                    <a href="pdf/Renault_R7054_R7055_manuel_reparation.pdf" target="_blank" class="pdf-button">Consulter le PDF</a>
                </div>
            `;
        }
    }
});
