<script setup lang="ts">
import { ArrowLeft, FileText } from 'lucide-vue-next';

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data: post, error } = await useFetch(() => `/api/blog/${slug.value}`);

const imageUrl = computed(() => {
  return post.value?.image_url || '';
});

const authorImageUrl = computed(() => {
  return post.value?.author?.image_url || '';
});

const publishDate = computed(() => {
  if (!post.value?.publish_date) return '';
  const date = new Date(post.value.publish_date);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const relatedPosts = computed(() => {
  if (!post.value?.related_posts) return [];
  return post.value.related_posts.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    image: p.image_url || '',
    publishedAt: p.publish_date,
    author: p.author?.name || '',
    categories: p.categories?.map((c: any) => c.name) || [],
  }));
});

useSeoMeta({
  title: () => `${post.value?.title || 'Blog Post'} | Directory`,
  description: () => post.value?.excerpt || 'Read this blog post.',
});
</script>

<template>
  <div class="py-8">
    <LayoutContainer>
      <div v-if="post" class="flex flex-col gap-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 flex flex-col">
            <div class="space-y-8">
              <div class="group overflow-hidden relative aspect-video rounded-lg transition-all border">
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  :alt="post.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <h1 class="text-3xl font-bold">{{ post.title }}</h1>

              <p class="text-lg text-muted-foreground">{{ post.excerpt }}</p>
            </div>

            <div class="mt-4">
              <p>{{ post.body }}</p>
            </div>

            <div class="flex items-center justify-start mt-16">
              <NuxtLink to="/blog">
                <UiButton variant="outline" class="gap-2">
                  <ArrowLeft class="size-4" />
                  All Posts
                </UiButton>
              </NuxtLink>
            </div>
          </div>

          <div>
            <div class="space-y-4 lg:sticky lg:top-24">
              <div class="bg-muted/50 rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Publisher</h2>
                <div class="flex items-center gap-4">
                  <div class="relative h-12 w-12 shrink-0">
                    <img
                      v-if="authorImageUrl"
                      :src="authorImageUrl"
                      :alt="post.author?.name"
                      class="w-full h-full rounded-full object-cover border"
                    />
                    <div
                      v-else
                      class="w-full h-full rounded-full bg-muted flex items-center justify-center text-lg font-semibold"
                    >
                      {{ post.author?.name?.charAt(0) || '?' }}
                    </div>
                  </div>
                  <div>
                    <span class="font-medium">{{ post.author?.name }}</span>
                    <p class="text-sm text-muted-foreground">{{ publishDate }}</p>
                  </div>
                </div>
              </div>

              <div v-if="post.categories?.length" class="bg-muted/50 rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Categories</h2>
                <ul class="flex flex-wrap gap-4">
                  <li v-for="category in post.categories" :key="category.id">
                    <NuxtLink
                      :to="`/blog/category/${category.slug}`"
                      class="text-sm link-underline"
                    >
                      {{ category.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div v-if="relatedPosts.length > 0" class="flex flex-col gap-8 mt-8">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-indigo-500" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              More Posts
            </h2>
          </div>

          <BlogGrid :posts="relatedPosts" />
        </div>
      </div>

      <SharedEmptyState
        v-else
        title="Post not found"
        description="The blog post you're looking for doesn't exist."
      >
        <NuxtLink to="/blog" class="mt-4">
          <UiButton>Browse all posts</UiButton>
        </NuxtLink>
      </SharedEmptyState>
    </LayoutContainer>
  </div>
</template>
