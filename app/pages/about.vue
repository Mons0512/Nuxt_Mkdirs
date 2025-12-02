<script setup lang="ts">
import { siteConfig } from '~/config/site';

useSeoMeta({
  title: 'About Us | Directory',
  description: 'Learn more about our directory and mission.',
});
</script>

<template>
  <div class="py-8">
    <LayoutContainer>
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold mb-6">About Us</h1>
        
        <div class="prose prose-lg dark:prose-invert">
          <p>
            Welcome to <strong>{{ siteConfig.name }}</strong>, your ultimate destination for discovering 
            the best tools, products, and resources for your projects.
          </p>

          <h2>Our Mission</h2>
          <p>
            We believe that finding the right tools shouldn't be a time-consuming task. 
            Our mission is to curate and organize the best resources so you can focus on 
            what matters most - building great products.
          </p>

          <h2>What We Offer</h2>
          <ul>
            <li><strong>Curated Collections</strong> - Hand-picked tools organized by category</li>
            <li><strong>Detailed Reviews</strong> - In-depth information about each tool</li>
            <li><strong>Regular Updates</strong> - New tools added weekly</li>
            <li><strong>Community Driven</strong> - Submit your favorite tools</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            Have questions or suggestions? We'd love to hear from you! 
            Reach out to us at <a :href="`mailto:${siteConfig.mail}`">{{ siteConfig.mail }}</a>.
          </p>
        </div>
      </div>
    </LayoutContainer>
  </div>
</template>
