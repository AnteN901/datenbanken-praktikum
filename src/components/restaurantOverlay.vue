<template>
    <div class="overlay">
        <div class="overlay-content">
            <!-- Your scrollable content here -->
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['restaurant']);
</script>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* Darkened background */
    backdrop-filter: blur(5px); /* Blurred background */
    z-index: 9999;
    overflow: hidden;
}

.overlay-content {
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    scrollbar-width: none; /* Hide scrollbar for Firefox */
    -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
}

.overlay-content::-webkit-scrollbar {
    width: 0; /* Hide scrollbar for Chrome, Safari, and Opera */
}
</style>
