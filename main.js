var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        description: `They are real warm!`,
        image: "./assets/img/vmSocks-green.jpg",
        inventory: 8,
        inStock: false,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        variants: [
            {
                variantId: 2234,
                variantColor: "green",
                variantImage: "./assets/img/vmSocks-green.jpg"
            },
            {
                variantId: 2235,
                variantColor: "blue",
                variantImage: "./assets/img/vmSocks-blue.jpg"
            }
        ],
        cart: 0,
        
    },
    methods: {
        addToCart(){
            this.cart += 1;
        },
        updateProduct(variantImage){
            this.image = variantImage;
        }
    }
});