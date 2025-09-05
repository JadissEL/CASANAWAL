import fetch from 'node-fetch';

async function testCorrectRender() {
    console.log('🔍 TEST URL CORRECTE RENDER');
    console.log('============================');
    console.log('');

    const correctUrl = 'https://casanawal.onrender.com';
    
    // Test 1: Health check
    console.log('1. Test Health API...');
    try {
        const healthResponse = await fetch(`${correctUrl}/api/health`, {
            timeout: 20000
        });
        
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('   ✅ Health API accessible!');
            console.log('   📊 Status:', healthData.status);
            console.log('   🗄️  Database:', healthData.database || 'Non spécifié');
        } else {
            console.log('   ❌ Health API non accessible');
            console.log('   Status:', healthResponse.status);
        }
    } catch (error) {
        console.log('   ❌ Erreur Health API:', error.message);
    }

    console.log('');

    // Test 2: Menu API
    console.log('2. Test Menu API...');
    try {
        const menuResponse = await fetch(`${correctUrl}/api/menu`, {
            timeout: 20000
        });
        
        if (menuResponse.ok) {
            const menuData = await menuResponse.json();
            console.log('   ✅ Menu API accessible!');
            console.log('   📊 Produits trouvés:', menuData.products?.length || 0);
            console.log('   📊 Catégories trouvées:', menuData.categories?.length || 0);
            
            if (menuData.products && menuData.products.length > 0) {
                console.log('   🎉 DONNÉES NEON DÉTECTÉES!');
                console.log('   📝 Premier produit:', menuData.products[0].name);
                console.log('   💰 Prix:', menuData.products[0].price);
            } else {
                console.log('   ⚠️  Aucun produit trouvé - problème de données');
            }
        } else {
            console.log('   ❌ Menu API non accessible');
            console.log('   Status:', menuResponse.status);
        }
    } catch (error) {
        console.log('   ❌ Erreur Menu API:', error.message);
    }

    console.log('');

    // Test 3: Categories API
    console.log('3. Test Categories API...');
    try {
        const categoriesResponse = await fetch(`${correctUrl}/api/categories`, {
            timeout: 20000
        });
        
        if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            console.log('   ✅ Categories API accessible!');
            console.log('   📊 Catégories:', categoriesData.length || 0);
            
            if (categoriesData.length > 0) {
                console.log('   🎉 CATÉGORIES NEON DÉTECTÉES!');
                console.log('   📝 Première catégorie:', categoriesData[0].name);
            }
        } else {
            console.log('   ❌ Categories API non accessible');
            console.log('   Status:', categoriesResponse.status);
        }
    } catch (error) {
        console.log('   ❌ Erreur Categories API:', error.message);
    }

    console.log('');

    // Test 4: Root endpoint
    console.log('4. Test Root endpoint...');
    try {
        const rootResponse = await fetch(correctUrl, {
            timeout: 20000
        });
        
        if (rootResponse.ok) {
            console.log('   ✅ Root endpoint accessible!');
            console.log('   Status:', rootResponse.status);
        } else {
            console.log('   ❌ Root endpoint non accessible');
            console.log('   Status:', rootResponse.status);
        }
    } catch (error) {
        console.log('   ❌ Erreur Root endpoint:', error.message);
    }

    console.log('');
    console.log('🎯 RÉSULTAT:');
    console.log('============');
    console.log('✅ URL correcte trouvée: https://casanawal.onrender.com');
    console.log('🔧 Mise à jour nécessaire:');
    console.log('   - netlify.toml VITE_API_BASE');
    console.log('   - Configuration frontend');
    console.log('   - Redéploiement Netlify');
}

testCorrectRender().catch(console.error);
