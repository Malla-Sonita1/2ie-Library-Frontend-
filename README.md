# 2iE Library - Système de Gestion de Bibliothèque Universitaire

Une application web moderne et interactive pour la gestion de bibliothèque universitaire, développée avec Next.js, React, TypeScript, Tailwind CSS (Frontend) et Node.js/Express, MySQL (Backend).

## 🚀 Fonctionnalités

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

## 🛠️ Technologies Utilisées
- **Frontend** : Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend** : Node.js, Express, MySQL
- **Authentification** : JWT
- **État global** : React Context
- **Animations** : Tailwind CSS
- **Icons** : Lucide React

## 📦 Installation

### Frontend
```bash
cd Frontend
pnpm install # ou npm install / yarn install
pnpm dev # ou npm run dev / yarn dev
```

### Backend
```bash
cd Backend
npm install
npm run dev # ou npm start
```

## 🔧 Configuration

### Frontend
- Variables d'environnement dans `.env.local` (voir exemple dans README Frontend)

### Backend
- Variables d'environnement dans `.env` (voir `.env.example`)
- Importer la base de données avec `database.sql` et `admin-data.sql`

## 🌐 Structure du Projet

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

## 🧪 Comptes de Test

### Étudiant
```json
{
  "email": "aminata.ouedraogo@2ie.edu",
  "password": "password123"
}
```

### Administrateur
```json
{
  "email": "ibrahim.sawadogo@2ie.edu",
  "password": "password123"
}
```

## 🚀 Déploiement

### Vercel (Frontend)
- Connecter le repo, configurer les variables d'environnement, déployer

### Docker (Backend)
```bash
docker build -t 2ie-library-backend .
docker run -p 3001:3000 2ie-library-backend
```

## 🤝 Contribution
- Fork, branche, PR, review (voir README d'origine)

## 📄 Licence
MIT

---
**2iE Library** - Bibliothèque Innovante pour l'Excellence Académique