<script setup lang="ts">
import { siteConfig } from '~/config/site';

useSeoMeta({
  title: 'Privacy Policy | Directory',
  description: 'Our privacy policy and how we handle your data.',
});
</script>

<template>
  <div class="py-8">
    <LayoutContainer>
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold mb-6">Privacy Policy</h1>
        
        <div class="prose prose-lg dark:prose-invert">
          <p>Last updated: {{ new Date().toLocaleDateString() }}</p>

          <h2>Introduction</h2>
          <p>
            {{ siteConfig.name }} ("we", "our", or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, and safeguard your information.
          </p>

          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li><strong>Personal Information</strong> - Name, email address when you submit a product or contact us</li>
            <li><strong>Usage Data</strong> - Information about how you use our website</li>
            <li><strong>Cookies</strong> - We use cookies to improve your experience</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and maintain our service</li>
            <li>Notify you about changes to our service</li>
            <li>Provide customer support</li>
            <li>Monitor the usage of our service</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at 
            <a :href="`mailto:${siteConfig.mail}`">{{ siteConfig.mail }}</a>.
          </p>
        </div>
      </div>
    </LayoutContainer>
  </div>
</template>
