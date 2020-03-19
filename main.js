Vue.config.devtools = true;

var eventBus = new Vue();

Vue.component("product", {
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
          
          <product-tabs :reviews="reviews" :selectedTab="selectedTab" ></product-tabs>
  
          </div>
      `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
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
      reviews: [],
      selectedTab: "Reviews"
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct(index) {
      this.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    saleActive() {
      return this.brand + this.product;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else {
        return "$3.99";
      }
    }
  },
  mounted() {
    eventBus.$on("review-submitted", productReview => {
      this.reviews.push(productReview);
    });
  }
});

Vue.component("product-review", {
  template: `
        <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Please correct the following errors(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </p>
        
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review" ></textarea>
        </p>


        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <label for="radio">Would you recommend? Tick for Yes!</label>
            <input type="radio" value="Yes" v-model="recommend">
        </p>
        <p>
            <input type="submit" value="Submit">
        </p>
        </form>

    `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: "No",
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        this.errors = [];
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = "No";
        eventBus.$emit("review-submitted", productReview);
      } else {
        this.errors = [];
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    }
  }
});

Vue.component("product-details", {
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
    return {};
  }
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true
    },
    selectedTab: {
      type: String,
      required: true
    }
  },
  template: `
        <div>
            <span class="tab"
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab,index) in tabs" 
                    :key="index"
                    @click="switchTabs"
                    >{{tab}}</span>

            <div v-show="selectedTab === 'Reviews'"> 
                <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul v-else>
                        <li v-for="review in reviews">
                        <P>{{ review.name }}</p>
                        <P>Rating: {{ review.rating }}</p>
                        <P>{{ review.review }}</p>
                        <P>Will recommend? - {{ review.recommend }}</p>
                        </li>
                    </ul>
            </div>            
        
            <product-review 
            v-show="selectedTab === 'Make a Review'"></product-review>


        </div>
        
        
    `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews"
    };
  },
  methods: {
    switchTabs(tab) {
      this.selectedTab = tab.target.innerText;
      console.log("yay");
      console.log(this.selectedTab, "  this ->> ", tab.target.innerText);
    }
  }
});

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    details: {
      data: "Big, nice and comfy",
      longData: "You really can't go wrong with a pair of these bad boys"
    },
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeFromCart(id) {
      for (var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }
  }
});
