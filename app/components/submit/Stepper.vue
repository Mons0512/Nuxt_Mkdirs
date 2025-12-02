<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { cn } from '~/utils';

interface Step {
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
  currentStep?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: 1,
});
</script>

<template>
  <div class="flex items-center w-full">
    <template v-for="(step, index) in steps" :key="step.title">
      <!-- Step item -->
      <div class="flex flex-col items-center gap-1">
        <!-- Step indicator -->
        <div
          :class="cn(
            'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
            currentStep > index + 1
              ? 'bg-primary text-primary-foreground'
              : currentStep === index + 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
          )"
        >
          <Check v-if="currentStep > index + 1" class="w-4 h-4" />
          <span v-else>{{ index + 1 }}</span>
        </div>

        <!-- Step title -->
        <span
          :class="cn(
            'text-sm font-medium',
            currentStep >= index + 1 ? 'text-primary' : 'text-muted-foreground'
          )"
        >
          {{ step.title }}
        </span>
      </div>

      <!-- Separator -->
      <div
        v-if="index < steps.length - 1"
        :class="cn(
          'flex-1 h-0.5 mx-4 mb-6',
          currentStep > index + 1 ? 'bg-primary' : 'bg-muted'
        )"
      />
    </template>
  </div>
</template>
