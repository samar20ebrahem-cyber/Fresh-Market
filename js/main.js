class ProductsService {
    constructor() {
        this.jsonUrl = 'products.json'; 
    }

    async getProducts() {
        try {
            let response = await fetch(this.jsonUrl);
            let data = await response.json();
            return data; 
        }
        catch(error) {
            console.error('Error loading the local JSON file:', error);
        }
    }
}

class UIManager {
    constructor() {
        this.productsContainer = document.getElementById('productsGrid'); 
        this.fallbackImg = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400";
        this.allProducts = [];
    }

    renderProducts(products, isFirstRun = true) {
        if (!this.productsContainer) return;
        if (isFirstRun) {
            this.allProducts = products;
        }
        
        this.productsContainer.innerHTML = ''; 
        if (products.length === 0) {
            this.productsContainer.innerHTML = `
                <p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem; color: #888; padding: 20px;">
                    No products found!
                </p>`;
            return; 
        }
        products.forEach(product => {  
            let badgeColor = "#2ecc71"; 
            if(product.category === "Meat") badgeColor = "#e74c3c"; 
            if(product.category === "Dairy & Eggs") badgeColor = "#3498db";
            if(product.category === "Spices") badgeColor = "#e67e22"; 
            if(product.category === "Fruits") badgeColor = "#f1c40f";

            const cardHTML = `
                <div class="card-grid">
                    <img src="${product.thumbnail || this.fallbackImg}" alt="${product.title}">
                    <h2>${product.title}</h2>
                    <span class="badge" style="background:${badgeColor}; color:#fff; padding:2px 8px; border-radius:4px; font-size:0.8rem; display:inline-block; margin-bottom:5px;">
                        ${product.category}
                    </span>
                    <span style="display:block; font-weight:bold; color:#2ed573; margin-bottom: 10px;">
                        $${product.price}
                    </span>
                    <button class="add-to-cart-btn">Buy Now</button>
                  </div>
            `;

            this.productsContainer.innerHTML += cardHTML;
        });

        this.addCartListeners();
    }

    addCartListeners(){
        let count = 0;
        const addButtons = document.querySelectorAll('.add-to-cart-btn');
        addButtons.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                count++;
                const spanCount = document.getElementById('cart-count');
                if (spanCount) {
                    spanCount.textContent = count;
                }
                const originalText = btn.textContent;
                btn.textContent = 'Added!';
                btn.style.backgroundColor = '#27ae60';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                }, 1000);
            });
        });
    }

    categorySearchBar(){   
        const searchBar = document.getElementById('input-search');
        if (!searchBar) return;
        searchBar.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase().trim();

            const filteredProducts = this.allProducts.filter(product => {
                return product.category.toLowerCase().includes(searchText);
            });
            this.renderProducts(filteredProducts, false); 

        });
        this.setupCategoryButtons()
    }
    setupCategoryButtons(){
        const categoryButtons = document.querySelectorAll('.check')
       
        categoryButtons.forEach(cbtn=>{
            cbtn.addEventListener('click',()=>{
            const selectedCategory = cbtn.getAttribute('data-category');

            const filteredProducts = this.allProducts.filter(product => {
                    return product.category.toLowerCase() === selectedCategory.toLowerCase();
                });
                this.renderProducts(filteredProducts, false);
            })
        })
    }

}


async function initApp() {
    const productService = new ProductsService();
    const uiManager = new UIManager();
    
    let allProducts = await productService.getProducts();  

    if (allProducts && allProducts.length > 0) {
        uiManager.renderProducts(allProducts);
        uiManager.categorySearchBar(); 
    }
}

initApp();