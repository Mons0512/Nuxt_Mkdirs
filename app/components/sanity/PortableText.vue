<script setup lang="ts">
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  blocks: any[];
}

const props = defineProps<Props>();

// Convert Portable Text blocks to HTML
const htmlContent = computed(() => {
  if (!props.blocks || !Array.isArray(props.blocks)) return '';
  return props.blocks.map(block => renderBlock(block)).join('');
});

function renderBlock(block: any): string {
  if (!block) return '';

  // Handle different block types
  switch (block._type) {
    case 'block':
      return renderTextBlock(block);
    case 'image':
      return renderImage(block);
    case 'code':
      return renderCode(block);
    default:
      return '';
  }
}

function renderTextBlock(block: any): string {
  const style = block.style || 'normal';
  const text = renderChildren(block.children || []);

  switch (style) {
    case 'h1':
      return `<h2 class="mt-10 scroll-m-20 text-3xl font-semibold border-b pb-1 first:mt-0">${text}</h2>`;
    case 'h2':
      return `<h3 class="mt-8 scroll-m-20 text-2xl font-semibold">${text}</h3>`;
    case 'h3':
      return `<h4 class="mt-8 scroll-m-20 text-xl font-semibold">${text}</h4>`;
    case 'h4':
      return `<h5 class="mt-6 scroll-m-20 text-lg font-semibold">${text}</h5>`;
    case 'blockquote':
      return `<blockquote class="mt-6 border-l-4 border-muted pl-4 italic text-muted-foreground">${text}</blockquote>`;
    default:
      return `<p class="mt-4 leading-7 [&:not(:first-child)]:mt-6">${text}</p>`;
  }
}

function renderChildren(children: any[]): string {
  return children.map(child => {
    if (child._type === 'span') {
      let text = escapeHtml(child.text || '');
      const marks = child.marks || [];
      
      marks.forEach((mark: string) => {
        switch (mark) {
          case 'strong':
            text = `<strong class="font-semibold">${text}</strong>`;
            break;
          case 'em':
            text = `<em>${text}</em>`;
            break;
          case 'code':
            text = `<code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">${text}</code>`;
            break;
          case 'underline':
            text = `<u>${text}</u>`;
            break;
          case 'strike-through':
            text = `<del>${text}</del>`;
            break;
          default:
            // Handle links
            if (mark.startsWith('link-')) {
              // Link marks are handled separately
            }
            break;
        }
      });
      
      return text;
    }
    return '';
  }).join('');
}

function renderImage(block: any): string {
  const imageUrl = getSanityImageUrl(block, { width: 800 });
  const alt = block.alt || 'Image';
  return `<figure class="mt-8"><img src="${imageUrl}" alt="${escapeHtml(alt)}" class="rounded-lg w-full" />${block.caption ? `<figcaption class="mt-2 text-center text-sm text-muted-foreground">${escapeHtml(block.caption)}</figcaption>` : ''}</figure>`;
}

function renderCode(block: any): string {
  const code = escapeHtml(block.code || '');
  const language = block.language || '';
  return `<pre class="mt-6 overflow-x-auto rounded-lg bg-muted p-4"><code class="text-sm font-mono language-${language}">${code}</code></pre>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m] || m);
}
</script>

<template>
  <div class="prose prose-lg dark:prose-invert max-w-none" v-html="htmlContent" />
</template>
