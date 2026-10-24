

console.log("Welcome to ShopEase Fashion Store!");

let cart = [];

function welcomeCustomer() {
    alert("Welcome to ShopEase! Happy Shopping!");
}

function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price
    });

    updateCart();
    alert(productName + " added to your cart!");
}
 
function updateCart() {
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const cartItems = document.getElementById("cart-items");
    cartCount.textContent = cart.length;

    const total = cart.reduce(function (sum, item) {
        return sum + item.price;
    }, 0);

    cartTotal.textContent = total;

    cartItems.innerHTML = "";

    cart.forEach(function (item, index) {
        const itemDiv = document.createElement("div");

        itemDiv.innerHTML = `
            <p>
                ${item.name} - ₹${item.price}
                <button onclick="removeFromCart(${index})">
                    Remove
                </button>
            </p>
        `;

        cartItems.appendChild(itemDiv);
    });
}
function removeFromCart(index){
    cart.splice(index,1);
    updateCart();
}


async function loadProducts() {
    try {
        const response = await fetch("http://localhost:8080/api/products");
        const products = await response.json();
        


        const container = document.getElementById("products-container");

        
container.innerHTML = products.map(product => {
    const productName = product.name.toLowerCase();

    let imageUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=400&fit=crop";

    if (productName.includes("jeans")) {
        imageUrl = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop";
    } else if (productName.includes("top")) {
        imageUrl = "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=400&h=400&fit=crop";
    }

    return `
        <div class="product-card">
            <img src="${imageUrl}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: ₹${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">
                Add to Cart
            </button>
            <button onclick="deleteProduct(${product.id})">
                Delete Product
            </button>
        </div>
    `;
}).join("");


        if (products.length === 0) {
            container.innerHTML = "<p>No products available.</p>";
        }
    } catch (error) {
        console.error("Error loading products:", error);
    }
}


loadProducts();

document.getElementById("product-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const product = {
        name: document.getElementById("product-name").value,
        category: document.getElementById("product-category").value,
        price: Number(document.getElementById("product-price").value),
        stock: Number(document.getElementById("product-stock").value)
    };

    try {
        const response = await fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error("Could not save product");
        }

        alert("Product added successfully! 💗");
        document.getElementById("product-form").reset();
        await loadProducts();

    } catch (error) {
        alert("Product could not be added. Please check whether the backend is running.");
        console.error(error);
    }
});

async function deleteProduct(id) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete product");
        }

        alert("Product deleted successfully!");
        await loadProducts();

    } catch (error) {
        alert("Could not delete product. Please check the backend.");
        console.error(error);
    }
}


