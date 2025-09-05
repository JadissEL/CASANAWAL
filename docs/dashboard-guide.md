# 🎛️ GUIDE D'ACCÈS AU DASHBOARD ADMIN COMPLET

## 🔑 CONNEXION
1. Allez sur : `http://localhost:8080/admin/login`
2. Email : `admin@test.com`
3. Mot de passe : `admin123`
4. Cliquez sur "Se connecter"

## 📋 LES 4 SECTIONS PRINCIPALES

### 📦 PRODUITS (Gestion des repas)
**URL** : `http://localhost:8080/admin/products`
**Description** : Gérer les repas, prix, catégories
**Contenu attendu** : Liste de 60+ produits avec prix et actions

### 💳 PAIEMENTS (Gestion des reçus)
**URL** : `http://localhost:8080/admin/payments`
**Description** : Voir les reçus uploadés, confirmer/rejeter
**Contenu attendu** : Liste des paiements avec actions admin

### 📊 ANALYTICS (Statistiques)
**URL** : `http://localhost:8080/admin/analytics`
**Description** : Graphiques et métriques
**Contenu attendu** : Graphiques de revenus, commandes, etc.

### 📋 COMMANDES (Gestion des commandes)
**URL** : `http://localhost:8080/admin/orders`
**Description** : Voir et gérer toutes les commandes
**Contenu attendu** : Liste de 11+ commandes avec statuts

## 🧭 NAVIGATION
- Utilisez la **sidebar gauche** pour naviguer entre les sections
- Ou tapez directement les URLs ci-dessus
- Chaque section devrait afficher du contenu différent

## ❓ RÉSOLUTION DE PROBLÈMES
Si vous ne voyez qu'une seule section :
1. Vérifiez que vous êtes sur la bonne URL
2. Utilisez la sidebar pour changer de section
3. Actualisez la page (F5)
4. Vérifiez que le serveur fonctionne sur le port 8080

## 🎯 TEST RAPIDE
Ouvrez ces 4 URLs dans 4 onglets différents pour vérifier :
- http://localhost:8080/admin/products
- http://localhost:8080/admin/payments  
- http://localhost:8080/admin/analytics
- http://localhost:8080/admin/orders

Chaque onglet devrait afficher du contenu différent !
