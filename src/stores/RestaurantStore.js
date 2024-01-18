import { defineStore } from 'pinia';
import axios from 'axios';
import { useCustomerStore } from './CustomerStore'; // Import the customer store

export const useRestaurantStore = defineStore('restaurant', {
    state: () => ({
        selectedRestaurant: null,
        restaurants: [], // This should be an array
        items: [],
        isLoading: false, // Add loading state
    }),
    actions: {
        setSelectedRestaurant(restaurant) {
            this.selectedRestaurant = restaurant;
        },
        clearSelectedRestaurant() {
            this.selectedRestaurant = null;
        },
        async getRestaurants() {
            const customerStore = useCustomerStore(); // Use the customer store
            this.isLoading = true; // Set loading state to true before fetching data
            try {
                console.log('Is logged in:', customerStore.isLoggedIn); // Debug line
                if (customerStore.isLoggedIn) {
                    const postal_code = customerStore.postal_code;
                    console.log('Postal code:', postal_code); // Debug line
                    const response = await axios.get(`http://localhost:3000/getRestaurantsFiltered?postal_code=${postal_code}`);
                    this.restaurants = response.data; // Set the state correctly
                } else {
                    const response = await axios.get('http://localhost:3000/getRestaurants');
                    this.restaurants = response.data; // Set the state correctly
                }
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
            } finally {
                this.isLoading = false; // Set loading state to false after fetching data
            }
        },
        async getRestaurantItems(restaurantId) {
            this.isLoading = true; // Set loading state to true before fetching data
            try {
                console.log('Fetching items for restaurant ID:', restaurantId); // Debug line
                const response = await axios.get(`http://localhost:3000/getRestaurantItems?restaurant_id=${restaurantId}`);
                this.items = response.data; // Set the state correctly with fetched items
            } catch (error) {
                console.error('Error fetching restaurant items:', error);
            } finally {
                this.isLoading = false; // Set loading state to false after fetching data
            }
        }
    },
});