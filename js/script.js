class Product {
    constructor(id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.discountPercentage = discountPercentage;
        this.rating = rating;
        this.stock = stock;
        this.brand = brand;
        this.category = category;
        this.thumbnail = thumbnail;
        this.images = images;
    }

    getRatingAsEmojis() {
        let count = Math.round(this.rating);
        let rating = "";
        for (let i = 0; i < count; i++) {
            rating += "⭐";
        }
        return rating;
    }

    getCardHTML() {
        return `
        <div class="card m-4" style="width: 18rem;">
            <img src="${this.images[1]}" height="200px" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${this.title}</h5>
            <p class="card-text">${this.description}</p>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Price: ${this.price} $</li>
            <li class="list-group-item">Stock: ${this.stock} items</li>
            <li class="list-group-item">Rating: ${this.getRatingAsEmojis()}</li>
        </ul>
        <div class="card-body">
            <button type="button" class="btn btn-primary">Add to cart</button>
        </div>
        </div>
        `;
    }

    getTableRowHTML() {
        return `
        <tr>
            <td>${this.title}</td>
            <td>${this.description}</td>
            <td>${this.price}</td>
            <td>${this.discountPercentage}</td>
            <td>${this.getRatingAsEmojis()}</td>
            <td>${this.stock}</td>
            <td>${this.brand}</td>
            <td>${this.category}</td>
        </tr>
        `;
    }
}

class Catalog {
    constructor() {
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        if (localStorage.getItem("products") == null) {
            // if the products item is not in the local storage, then load the products list from the web
            this.getProductsFromWeb();
            console.log("load from web");

        } else if (localStorage.getItem("products") != null) {
            // if the products item is in the local storage, then load the products list from the local storage
            this.getProductsFromLocalStorage();
            console.log("load from local storage");

        } else {
            // if there is an error, clear the local storage and show an error message
            this.clearLocalStorage();
            console.error("Error loading products");
        }
    }

    addProduct(product) {
        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    getProductsFromWeb() {
        let req = new XMLHttpRequest();
        req.open("GET", "https://dummyjson.com/products");
        req.send();

        req.onprogress = (event) => {
            let percent = (event.loaded / event.total) * 100;
            this.updateProgressBar(true, percent);
        }

        req.onload = (e) => {
            let data = JSON.parse(req.responseText);

            if (data == null || data == undefined || data == "") {
                console.error("Error while parsing products from web");
                return;
            }

            data["products"].forEach(product => {
                this.addProduct(new Product(
                    product.id,
                    product.title,
                    product.description,
                    product.price,
                    product.discountPercentage,
                    product.rating,
                    product.stock,
                    product.brand,
                    product.category,
                    product.thumbnail,
                    product.images
                ));
            });

            this.saveToLocalStorage();
            this.printProducts();
            this.updateProgressBar(false, 0);

        }

        req.onerror = (error) => {
            console.log(error);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem("products", JSON.stringify(this.products));
    }
    clearLocalStorage() {
        localStorage.removeItem("products");
    }

    getProductsFromLocalStorage() {
        let products = JSON.parse(localStorage.getItem("products"));

        products.forEach(product => {
            this.addProduct(new Product(
                product.id,
                product.title,
                product.description,
                product.price,
                product.discountPercentage,
                product.rating,
                product.stock,
                product.brand,
                product.category,
                product.thumbnail,
                product.images
            ));
        });

        this.printProducts();
    }

    updateProgressBar(isVisible, percent) {
        let parentDiv = document.getElementById("progress-bar");
        let progressBar = document.getElementById("progressBar");

        parentDiv.style.visibility = isVisible ? "visible" : "hidden";
        progressBar.style.width = percent + "%";
    }

    printProducts() {
        let html = "";
        let contentView = document.getElementById("content");
        const MODE = contentView.getAttribute("data-mode");

        if (MODE == null || MODE == "" || MODE == undefined) {
            console.error("Required attribute 'data-mode' not found");
            return;
        }

        switch (MODE) {
            case "cards":
                this.products.forEach(product => {
                    html += product.getCardHTML();
                });
                break;

            case "table":
                html += ` <tr><th>Title</th><th>Description</th><th>Price</th><th>Discount</th><th>Rating</th><th>Stock</th><th>Brand</th><th>Category</th></tr>`;
                this.products.forEach(product => {
                    html += product.getTableRowHTML();
                });
                break;

            default:
                console.error("Error printing products on page");
        }
        document.getElementById("content").innerHTML = html;
    }
}

onload = () => {
    let catalog = new Catalog();
}