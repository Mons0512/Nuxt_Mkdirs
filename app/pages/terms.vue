<script setup lang="ts">
import { siteConfig } from '~/config/site';

useSeoMeta({
  title: 'Terms of Service | Directory',
  description: 'Our terms of service and usage guidelines.',
});
</script>

<template>
  <div class="py-8">
    <LayoutContainer>
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold mb-6">Terms of Service</h1>
        
        <div class="prose prose-lg dark:prose-invert">
          <p>Last updated: {{ new Date().toLocaleDateString() }}</p>

          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using {{ siteConfig.name }}, you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, you may not access the service.
          </p>

          <h2>Use of Service</h2>
          <p>
            Our service allows you to browse, search, and discover various tools and products. 
            You agree to use the service only for lawful purposes.
          </p>

          <h2>User Submissions</h2>
          <p>
            When you submit a product to our directory, you represent that:
          </p>
          <ul>
            <li>You have the right to submit the product</li>
            <li>The information provided is accurate</li>
            <li>The submission does not violate any laws or third-party rights</li>
          </ul>

          <h2>Disclaimer</h2>
          <p>
            The service is provided "as is" without warranties of any kind. 
            We do not guarantee the accuracy or completeness of any information on the site.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at 
            <a :href="`mailto:${siteConfig.mail}`">{{ siteConfig.mail }}</a>.
          </p>
        </div>
      </div>
    </LayoutContainer>
  </div>
</template>
