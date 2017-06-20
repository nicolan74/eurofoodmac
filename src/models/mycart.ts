import { Product } from '../models/product';
import { ProductInCart } from '../models/productInCart';


// import { ProductDetailsPage } from '../../../product-details/product-details';

export class MyCart {
    qty: number;

    static instance: MyCart;
    // products: Product[] = [];

    products: ProductInCart[] = []

    // inseRisco per gestire incremento qty nel caso il prodotto esiste
    product: Product;

    static getInstance(): MyCart {
        if (MyCart.instance == null) {
            MyCart.instance = new MyCart();
        }
        return MyCart.instance;
    }

    // addProduct(product: Product) {
    addProduct(productInCart: ProductInCart) {

        // if (!(this.products.indexOf(product) > -1)) {
        // if (product.id) {
        //     console.log('Prodotto è già carrello ')
        //     this.PRODUCT_IN_CART = true
        // } else {
        // this.products.push(product)
        //     console.log('Prodotto NO nel carrello ')
        // }

        // this.products contine tutti i prodotti del carrello
        // this.products.push(product)


        // product è quello che viene aggiunto di volta in volta

        // console.log('---> This product (mycart.ts) ', product)
        console.log('----> Id Prodotto su cui si è cliccato AGGIUNGI AL CARRELLO ', productInCart.id)

        var PRODUCT_IN_CART = false


        // Questi sono sempre i prodotti del carrello
        for (let p of this.products) {
            console.log('ID Prodotti nel CArrello ', p.id)

            // if (product.id != p.id) {
            if (p.id == productInCart.id) {
                // console.log('Prodotto è già carrello ')
                PRODUCT_IN_CART = true
                console.log('Product in cart? (nel for)', PRODUCT_IN_CART)
                console.log('--> ARRAY This products (mycart.ts PRIMA DI ADD QTY)', this.products)

                console.log('Il prodotto esiste nel carrello: aggiungo quantità (prima) ', p.qty)

                p.qty += productInCart.qty

                console.log('Il prodotto esiste nel carrello: aggiungo quantità (dopo) ', p.qty)
                console.log('--> ARRAY This products (mycart.ts DOPO DI ADD QTY)', this.products)
                console.log('---> OBJECT This product (mycart.ts) ', productInCart)

                console.log('productInCart.stock_available in MyCART', productInCart.stock_available)


                if (p.qty == productInCart.stock_available) {
                    console.log('RAGGIUNTA MAX QTY ORDINABILE')

                }

                break
            }

        }
        if (!PRODUCT_IN_CART) {
            console.log('Product in cart? (nel if)', PRODUCT_IN_CART)
            this.products.push(productInCart)
            console.log('--> ARRAY This products (mycart.ts)', this.products)
        }

        
 

    } // end addProduct

    empty() {
        this.products = []
        console.log('this products after empty in mycart', this.products)
    }

    public clear(): void {
        this.products = [];
        console.log('this products after clear ', this.products)
    }

    deleteProductInCart(productInCart: ProductInCart): void {

        let index = this.products.indexOf(productInCart);

        if (index > -1) {
            this.products.splice(index, 1);

        }
    }

    // deleteAllProduct(productInCart: ProductInCart): void {

    //     let index = this.products.indexOf(productInCart);

    //     if (index > -1) {
    //         this.products.splice(index, 1);
    //     }

} // class MyCart

// class MyAppProperties {
//    static nomeApp: string
//}


// MyAppProperties.nomeApp = "pippo"

