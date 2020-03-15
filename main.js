Vue.component('product-details',{
    props: {
        details: {
            type: Object,
            required: true
        }
    },
    template: `
        <div>
            <h1>{{ details.data }}</h1>
            <p>{{ details.longData }}</p>
        </div>
    `,
    data() {
        return {

        }
    }
})

Vue.component('product',{
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
        <div class="product-image">
            <img :src="image">
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <h2 v-show="onSale">{{ saleActive }}</h2>
            <p v-if="inStock">In Stock</p>
            <p v-else
                :class="{ outOfStock: !inStock }">Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>
            <ul>
            <li v-for="detail in details">{{detail}}</li>
            </ul>

            <div v-for="(variant, index) in variants" 
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)">
            </div>

        </div>
        
        <button v-on:click="addToCart" 
                    :disabled="!inStock"
                    :class="{disabledButton: !inStock}">Add to Cart</button>
        <button class="removeCartButton" v-on:click="removeFromCart" 
                    >Remove from Cart</button>
        

        </div>
    `,
    data() {
        return  {
            brand: 'Vue Mastery',
            product: 'Socks',
            description: `They are real warm!`,
            selectedVariant: 0,
            onSale: true,
            inventory: 8,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/img/vmSocks-green.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/img/vmSocks-blue.jpg",
                    variantQuantity: 0
                }
            ],
            
            
            }
    },
    methods: {
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            
        },
        removeFromCart(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);    
        },
        updateProduct(index){
            this.selectedVariant = index;
        }
    },
    computed: {
        title(){
            return this.brand + " " + this.product;
        },
        image(){
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        saleActive(){
            return this.brand + this.product;
        },
        shipping(){
            if (this.premium){
                return "Free"
            } else {
                return "$3.99"
            }
        }
    }
})


var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        details: {
            data: "Big, nice and comfy",
            longData: "You really can't go wrong with a pair of these bad boys"
        },
        cart: []
    },
    methods: {
        updateCart(id){
            this.cart.push(id);
        },
        removeFromCart(id){
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                   this.cart.splice(i, 1);
                }
              }
        }
    }
});