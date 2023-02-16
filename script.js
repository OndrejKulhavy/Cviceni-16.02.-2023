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

    getRating() {
        let count = Math.round(this.rating);
        let rating = "";
        for (let i = 0; i < count; i++) {
            rating += "⭐";
        }
        return rating;
    }

    getCardHTML() {
        let html = `
        <div class="card m-4" style="width: 18rem;">
            <img src="${this.images[1]}" height="200px" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${this.title}</h5>
            <p class="card-text">${this.description}</p>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Price: ${this.price} $</li>
            <li class="list-group-item">Stock: ${this.stock} items</li>
            <li class="list-group-item">Rating: ${this.getRating()}</li>
        </ul>
        <div class="card-body">
            <button type="button" class="btn btn-primary">Add to cart</button>
        </div>
        </div>
        `;
        return html;
    }

    getTableRow() {
        let html = `
        <tr>
            <td>${this.id}</td>
            <td>${this.title}</td>
            <td>${this.description}</td>
            <td>${this.price}</td>
            <td>${this.discountPercentage}</td>
            <td>${this.getRating()}</td>
            <td>${this.stock}</td>
            <td>${this.brand}</td>
            <td>${this.category}</td>
        </tr>
        `;
        return html;
    }
}

class Catalog {
    constructor() {
        this.products = [];
        if (localStorage.getItem("products") == null || localStorage.getItem("products") == "[]") {
            this.loadProductsFromWeb();
            this.saveToLocalStorage();
        } else {
            this.loadFromLocalStorage();
        }
        console.log(this.products);
    }

    addProduct(product) {
        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    loadProductsFromWeb() {
        let url = 'https://dummyjson.com/products';
        let progressBar = document.getElementById("progress-bar");
        progressBar.style.width = "0%";
        progressBar.style.visibility = "visible";
        const req = new XMLHttpRequest();
        req.open("GET", url);
        req.send();

        //print progress in %
        req.onprogress = (event) => {
            let percent = (event.loaded / event.total) * 100;
            progressBar.style.width = percent + "%";
            console.log(percent);
        }

        req.onload = (e) => {
            let data = JSON.parse(req.responseText);
            console.log(data);
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
            this.printProducts();
            console.log(e.total);
            progressBar.style.visibility = "hidden";
        }
        req.onerror = (error) => {
            console.log(error);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem("products", JSON.stringify(this.products));
    }
    removeLocalStorage() {
        localStorage.removeItem("products");
    }

    loadFromLocalStorage() {
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


    printProducts() {
        let html = "";

        let contentView = document.getElementById("content");
        let mode = contentView.getAttribute("data-mode");
        if (mode == "cards") {
            this.products.forEach(product => {
                html += product.getCardHTML();
            });
        } else if (mode == "table") {
            this.products.forEach(product => {
                html += product.getTableRow();
            });
        }

        document.getElementById("content").innerHTML = html;
        console.log(html);
    }

}

let catalog = new Catalog();
