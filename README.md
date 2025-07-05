# 2iE Library - Système de Gestion de Bibliothèque Universitaire

Une application web moderne et interactive pour la gestion de bibliothèque universitaire, développée avec Next.js, React, TypeScript, Tailwind CSS (Frontend) et Node.js/Express, MySQL (Backend).

##  Fonctionnalités

### Interface Étudiante
- **Authentification** : Inscription, connexion sécurisée JWT, gestion du token
- **Catalogue de livres** : Recherche, filtrage, pagination, affichage dynamique
- **Réservations** : Réservation de livres, gestion des statuts, limite d'emprunts
- **Évaluations** : Notation, commentaires, affichage des avis
- **Profil utilisateur** : Gestion du compte, historique des emprunts
- **Notifications** : Alertes pour retards, rappels

### Interface Administrateur
- **Tableau de bord** : Statistiques réelles (livres, utilisateurs, emprunts, retards)
- **Gestion des livres** : CRUD complet, suppression, édition, ajout
- **Gestion des utilisateurs** : Activation/désactivation, gestion des comptes
- **Statistiques** : Graphiques, analyses, catégories populaires
- **Export de données** : Export CSV

### Fonctionnalités Générales
- **Design responsive** : Mobile, tablette, desktop
- **Mode sombre/clair** : Thème adaptatif
- **Chatbot** : Assistant virtuel
- **Accessibilité** : ARIA, navigation clavier

##  Technologies Utilisées
- **Frontend** : Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend** : Node.js, Express, MySQL
- **Authentification** : JWT
- **État global** : React Context
- **Animations** : Tailwind CSS
- **Icons** : Lucide React

##  Installation

### Frontend
```bash
cd Frontend
npm install # ou  yarn install / pnpm install
npm run dev # ou  yarn dev / pnpm dev
```

### Backend
```bash
cd Backend
npm install
npm run dev # ou npm start
```

##  Configuration

### Frontend
- Variables d'environnement dans `.env.local` (voir exemple dans README Frontend)

### Backend
- Variables d'environnement dans `.env` (voir `.env.example`)
- Importer la base de données avec `database.sql` et `admin-data.sql`

##  Structure du Projet

```
Projet/
├── Frontend/
│   ├── app/                # Pages Next.js (App Router)
│   │   ├── admin/          # Interface admin (dashboard, gestion livres, users)
│   │   ├── api/            # Routes API Next.js
│   │   ├── auth/           # Authentification (login, register)
│   │   ├── catalogue/      # Catalogue de livres
│   │   ├── contact/        # Page contact
│   │   ├── dashboard/      # Dashboard utilisateur
│   │   ├── emprunts/       # Emprunts utilisateur
│   │   ├── evenements/     # Événements
│   │   ├── mon-compte/     # Profil utilisateur
│   │   ├── notifications/  # Notifications
│   │   ├── reservations/   # Réservations
│   │   └── ...
│   ├── components/         # Composants réutilisables
│   │   ├── admin/          # Composants admin (admin-dashboard, admin-books-management, AdminStats...)
│   │   ├── catalogue/      # Composants catalogue
│   │   ├── evenements/     # Composants événements
│   │   ├── mon-compte/     # Composants profil
│   │   ├── reservations/   # Composants réservations
│   │   ├── ui/             # UI générique (button, badge, card...)
│   │   ├── BookRatingComments.tsx
│   │   ├── chatbot.tsx
│   │   ├── conditional-navbar.tsx
│   │   ├── footer.tsx
│   │   ├── mode-toggle.tsx
│   │   ├── navbar.tsx
│   │   ├── protected-route.tsx
│   │   ├── sidebar.tsx
│   │   └── theme-provider.tsx
│   ├── contexts/           # Contextes React (auth-context...)
│   ├── hooks/              # Hooks personnalisés (use-mobile, use-toast...)
│   ├── lib/                # Fonctions utilitaires (api.ts, utils.ts)
│   ├── public/             # Images et assets statiques
│   ├── styles/             # Fichiers CSS globaux
│   └── ...
├── Backend/
│   ├── config/             # Configuration DB (db.js)
│   ├── controllers/        # Logique métier (authController.js, bookController.js, ...)
│   ├── jobs/               # Cron jobs (expireReservationsJob.js, notifyLateReturns.js)
│   ├── middlewares/        # Middlewares Express (auth, error, role)
│   ├── models/             # Modèles Sequelize/Mongoose (bookModel.js, userModel.js...)
│   ├── routes/             # Définition des routes (authRoutes.js, bookRoutes.js...)
│   ├── utils/              # Utilitaires (mailer.js, validator.js)
│   ├── server.js           # Entrée principale serveur
│   ├── database.sql        # Script SQL de création
│   ├── admin-data.sql      # Données d'admin
│   ├── importBooks.js      # Script d'import de livres
│   ├── generateAdminPasswords.js # Génération de mots de passe admin
│   └── ...
```

```

##  Déploiement

### Vercel (Frontend)
- Connecter le repo, configurer les variables d'environnement, déployer

### Docker (Backend)
```bash
docker build -t 2ie-library-backend .
docker run -p 3001:3000 2ie-library-backend
```

##  Contribution
- Fork, branche, PR, review (voir README d'origine)

##  Licence
MIT

## Tester le projet (Procédure pour l'évaluateur)

### 1. Préparer le Backend
- Suivre les instructions du README du dossier Backend pour créer la base de données, les tables, et importer les données (admins, livres, etc.).
- S'assurer que le backend fonctionne sur `http://localhost:3001` (ou le port défini dans `.env`).

### 2. Préparer le Frontend
1. Installer les dépendances :
   ```bash
   pnpm install # ou npm install / yarn install
   ```
2. Configurer le fichier `.env.local` à la racine du dossier Frontend :
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME=2iE Library
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```
   > Adapter l'URL si le backend tourne sur un autre port.
3. Lancer le serveur de développement :
   ```bash
   pnpm dev # ou npm run dev / yarn dev
   ```
4. Accéder à l'application sur [http://localhost:3000](http://localhost:3000)

### 3. Tester les fonctionnalités
- **Inscription/Connexion** : Créer un compte étudiant ou utiliser un compte admin existant.
- **Catalogue** : Parcourir, rechercher, filtrer les livres.
- **Réservations** : Réserver un livre, voir l'historique, annuler.
- **Gestion admin** : Se connecter en tant qu'admin, accéder au dashboard, gérer livres et utilisateurs.
- **Commentaires/Évaluations** : Ajouter des avis sur les livres.
- **Notifications** : Vérifier la réception des alertes (retards, rappels).
- **Chatbot** : Tester l'assistant virtuel.

### 4. Données de test
- Utiliser les comptes fournis dans le README (admin et étudiant) ou en créer de nouveaux.
- Les livres et admins sont déjà présents si les scripts d'import ont été suivis.

### 5. Conseils
- Si une fonctionnalité ne marche pas, vérifier la console du navigateur et du backend pour les erreurs.
- S'assurer que le backend est bien démarré avant le frontend.
- Adapter les variables d'environnement si besoin.

---
**Votre projet est prêt à être testé dans les conditions réelles d'une soutenance ou d'une évaluation.**

---
**2iE Library** - Bibliothèque Innovante pour l'Excellence Académique