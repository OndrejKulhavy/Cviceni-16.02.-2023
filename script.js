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
}

class Catalog {
    constructor() {
        this.products = [];
        this.loadProducts();
        console.log(this.products);
    }

    addProduct(product) {
        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    loadProducts() {
        let url = 'https://dummyjson.com/products';

        const req = new XMLHttpRequest();
        req.open("GET", url);
        req.send();
        req.onload = () => {
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
        }
        req.onerror = () => {
            console.log("Error loading products");
        }
    }

}

let catalog = new Catalog();
