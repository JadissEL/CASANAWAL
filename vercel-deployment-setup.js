import fs from 'fs';

function setupVercelDeployment() {
    console.log('🚀 SOLUTION ALTERNATIVE: DÉPLOIEMENT VERCEL');
    console.log('============================================');
    console.log('');

    // 1. Créer vercel.json
    console.log('1. Création configuration Vercel...');
    const vercelConfig = {
        "version": 2,
        "builds": [
            {
                "src": "client/**/*",
                "use": "@vercel/static-build",
                "config": {
                    "distDir": "dist/spa"
                }
            },
            {
                "src": "server/**/*",
                "use": "@vercel/node"
            }
        ],
        "routes": [
            {
                "src": "/api/(.*)",
                "dest": "/server/index.ts"
            },
            {
                "src": "/(.*)",
                "dest": "/client/$1"
            }
        ],
        "env": {
            "NODE_ENV": "production",
            "DATABASE_URL": "postgresql://neondb_owner:napi_ay0n1u1vujgf9559v0ml4kmeccf4pfqsxd9223r2jaqsg4aq9auewg4aq9auewg4psuz7vu3x@ep-sparkling-night-aglvdfcg-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require",
            "JWT_SECRET": "casanawal_super_secret_jwt_key_2024_production",
            "CORS_ORIGIN": "https://casanawal.vercel.app",
            "ADMIN_EMAIL": "elantaki.dijadiss@gmail.com",
            "ADMIN_PASSWORD": "XCDXCD963j3j+.1",
            "PORT": "3000"
        }
    };

    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    console.log('   ✅ vercel.json créé');

    // 2. Créer .vercelignore
    console.log('2. Création .vercelignore...');
    const vercelIgnore = `node_modules
.env
.env.local
.env.production.local
.env.development.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
.vscode
.idea
*.log
dist
build
coverage
.nyc_output
.cache
.parcel-cache
.next
.nuxt
.vuepress/dist
.serverless
.fusebox
.dynamodb
.tern-port
.vercel
`;

    fs.writeFileSync('.vercelignore', vercelIgnore);
    console.log('   ✅ .vercelignore créé');

    // 3. Modifier package.json pour Vercel
    console.log('3. Modification package.json pour Vercel...');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Ajouter scripts Vercel
    packageJson.scripts = {
        ...packageJson.scripts,
        "vercel-build": "npm run build:client && npm run build:server",
        "vercel-dev": "npm run dev"
    };

    // Ajouter engines pour Vercel
    packageJson.engines = {
        "node": ">=20 <=22.19.0"
    };

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('   ✅ package.json modifié pour Vercel');

    // 4. Créer guide de déploiement
    console.log('4. Création guide de déploiement...');
    const deploymentGuide = `# Guide de Déploiement Vercel

## 🚀 Déploiement Rapide (5 minutes)

### 1. Installation Vercel CLI
\`\`\`bash
npm install -g vercel
\`\`\`

### 2. Connexion Vercel
\`\`\`bash
vercel login
\`\`\`

### 3. Déploiement
\`\`\`bash
vercel --prod
\`\`\`

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
`;

    fs.writeFileSync('VERCEL_DEPLOYMENT_GUIDE.md', deploymentGuide);
    console.log('   ✅ Guide de déploiement créé');

    console.log('');
    console.log('🎯 CONFIGURATION VERCEL TERMINÉE!');
    console.log('=================================');
    console.log('');
    console.log('✅ Fichiers créés:');
    console.log('   • vercel.json (configuration)');
    console.log('   • .vercelignore (fichiers à ignorer)');
    console.log('   • package.json (modifié pour Vercel)');
    console.log('   • VERCEL_DEPLOYMENT_GUIDE.md (guide)');
    console.log('');
    console.log('🚀 PROCHAINES ÉTAPES:');
    console.log('=====================');
    console.log('1. Installer Vercel CLI: npm install -g vercel');
    console.log('2. Se connecter: vercel login');
    console.log('3. Déployer: vercel --prod');
    console.log('4. Votre site sera opérationnel en 5 minutes!');
    console.log('');
    console.log('💡 AVANTAGES VERCEL:');
    console.log('====================');
    console.log('✅ Déploiement plus simple que Render');
    console.log('✅ Variables d\'environnement automatiques');
    console.log('✅ Pas de problèmes de build');
    console.log('✅ Support PostgreSQL natif');
    console.log('✅ CDN global intégré');
    console.log('✅ Monitoring intégré');
    console.log('');
    console.log('🎉 VOTRE SITE SERA OPÉRATIONNEL AVEC VERCEL!');
}

setupVercelDeployment();
