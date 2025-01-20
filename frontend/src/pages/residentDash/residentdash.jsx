import React from 'react';
import HeaderResident from '../../components/HeaderResident/HeaderResident';
import './ResidentDash.css'; // Importez votre fichier CSS pour le style

const ResidentDash = () => {
  return (
    <div>
      <HeaderResident />
      <div className="resident-dashboard"></div>
      <div className="welcome-section">
        <h1>Bienvenue Résident Étudiant !</h1>
        <p>Nous sommes ravis de vous avoir ici. Consultez les dernières mises à jour et ressources disponibles pour vous.</p>
      </div>
      
      <div className="content-section">
        <h2>Annonces Récentes</h2>
        <ul className="announcements">
          <li>🏡 Les inspections des chambres auront lieu la semaine prochaine. Veuillez vous assurer que votre chambre est en ordre !</li>
          <li>📅 Rejoignez-nous pour la prochaine réunion des résidents vendredi à 17h dans la salle commune.</li>
          <li>🛠️ Les demandes de maintenance peuvent maintenant être soumises directement via l'application !</li>
        </ul>
        
        <h2>Liens Rapides</h2>
        <div className="quick-links">
          <a href="/maintenance" className="link">Demander une Maintenance</a>
          <a href="/events" className="link">Événements à Venir</a>
          <a href="/payments" className="link">Effectuer un Paiement</a>
          <a href="/feedback" className="link">Donner un Retour</a>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Résidence ETU. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default ResidentDash;
