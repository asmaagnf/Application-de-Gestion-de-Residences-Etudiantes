# Application de Gestion de Résidences Étudiantes

Bienvenue dans l'application de gestion de résidences étudiantes. Ce projet a pour objectif de simplifier la gestion des chambres, des résidents et des paiements au sein d'une résidence étudiante.

## Fonctionnalités principales

- **Gestion des chambres** : Ajouter, modifier, supprimer et consulter les chambres.
- **Gestion des résidents** : Assigner et désassigner des résidents aux chambres.
- **Paiements** : Génération des paiements mensuels, suivi des paiements, et envoi de rappels pour les paiements en retard.
- **Statistiques** : Obtenir des statistiques sur la capacité totale et les chambres disponibles.

## Technologies utilisées

- **Backend** : Spring Boot (port : 8080)
- **Frontend** : React.js (port : 5173)
- **Base de données** : MySQL
- **Outils de build** : Maven
- **Frameworks supplémentaires** : Hibernate, Spring Data JPA
- **Autres bibliothèques** : iText pour la génération de PDF

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre système :

- Java 17 ou version ultérieure
- Maven
- MySQL
- Node.js et npm

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/asmaagnf/Application-de-Gestion-de-Residences-Etudiantes
```

### 2. Configuration de la base de données

Créez une base de données MySQL et mettez à jour les informations de connexion dans le fichier `application.properties` du backend :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/residence_etu
spring.datasource.username=VOTRE_NOM_UTILISATEUR
spring.datasource.password=VOTRE_MOT_DE_PASSE
```

### 3. Démarrer le backend

Accédez au répertoire du backend et démarrez le serveur :

```bash
cd backend/ResidenceETU
mvn spring-boot:run
```

Le backend sera disponible sur [http://localhost:8080](http://localhost:8080).

### 4. Démarrer le frontend

Accédez au répertoire du frontend, installez les dépendances et démarrez l'application :

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera disponible sur [http://localhost:5173](http://localhost:5173).

## Auteurs
- Asmaa Gandaffa
