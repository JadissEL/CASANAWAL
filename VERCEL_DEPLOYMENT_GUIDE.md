# Guide de Déploiement Vercel

## 🚀 Déploiement Rapide (5 minutes)

### 1. Installation Vercel CLI
```bash
npm install -g vercel
```

### 2. Connexion Vercel
```bash
vercel login
```

### 3. Déploiement
```bash
vercel --prod
```

### 4. Configuration Variables d'Environnement
Les variables sont déjà configurées dans vercel.json :
- NODE_ENV=production
- DATABASE_URL=[URL Neon]
- JWT_SECRET=[Secret JWT]
- CORS_ORIGIN=https://casanawal.vercel.app
- ADMIN_EMAIL=elantaki.dijadiss@gmail.com
- ADMIN_PASSWORD=XCDXCD963j3j+.1
- PORT=3000

## 🔍 Vérifications
- Site: https://casanawal.vercel.app
- API: https://casanawal.vercel.app/api/health
- Menu: https://casanawal.vercel.app/api/menu

## ✅ Avantages Vercel
- Déploiement automatique depuis GitHub
- Variables d'environnement faciles
- Support PostgreSQL natif
- Pas de problèmes de build
- CDN global intégré
- Monitoring intégré

## 🎯 Résultat
Votre site CasaNawal sera opérationnel en 5 minutes avec toutes vos données Neon !
