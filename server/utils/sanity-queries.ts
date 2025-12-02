/**
 * Sanity GROQ Queries
 * Ported from the original Next.js project
 */

// Item fields
export const itemSimpleFields = /* groq */ `
  _id,
  _createdAt,
  name,
  slug,
  description,
  link,
  affiliateLink,
  sponsor,
  sponsorStartDate,
  sponsorEndDate,
  note,
  featured,
  icon {
    ...,
    "blurDataURL": asset->metadata.lqip,
    "imageColor": asset->metadata.palette.dominant.background,
  },
  image {
    ...,
    "blurDataURL": asset->metadata.lqip,
    "imageColor": asset->metadata.palette.dominant.background,
  },
  publishDate,
  paid,
  order,
  pricePlan,
  freePlanStatus,
  proPlanStatus,
  sponsorPlanStatus,
  rejectionReason,
  submitter->,
  collections[]->,
  categories[]->,
  tags[]->,
`;

const itemFields = /* groq */ `
  ${itemSimpleFields}
  introduction,
`;

// Category fields
const categoryFields = /* groq */ `
  ...,
`;

// Tag fields
const tagFields = /* groq */ `
  ...,
`;

// Group fields
export const groupFields = /* groq */ `
  ...,
  "categories": *[_type=='category' && references(^._id)] | order(priority desc, _createdAt asc)
  { 
    ..., 
  }
`;

// Collection fields
export const collectionFields = /* groq */ `
  ...,
  icon {
    ...,
    "blurDataURL": asset->metadata.lqip,
    "imageColor": asset->metadata.palette.dominant.background,
  },
`;

// Blog post fields
export const blogPostSimpleFields = /* groq */ `
  _id,
  _createdAt,
  title,
  slug,
  excerpt,
  featured,
  image {
    ...,
    "blurDataURL": asset->metadata.lqip,
    "imageColor": asset->metadata.palette.dominant.background,
  },
  publishDate,
  author->,
  categories[]->,
`;

const blogPostFields = /* groq */ `
  relatedPosts[]-> {
    ${blogPostSimpleFields}
  },
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug
      }
    }
  },
  ${blogPostSimpleFields}
`;

const blogCategoryFields = /* groq */ `
  name,
  slug,
  description,
  priority,
`;

// ============================================================================
// Item Queries
// ============================================================================

export const itemByIdQuery = `*[_type == "item" && _id == $id][0] {
  ${itemSimpleFields}
}`;

export const itemInfoBySlugQuery = `*[_type == "item" && slug.current == $slug][0] {
  ${itemSimpleFields}
}`;

export const itemFullInfoByIdQuery = `*[_type == "item" && _id == $id][0] {
  ${itemFields}
}`;

export const itemFullInfoBySlugQuery = `*[_type == "item" && slug.current == $slug 
&& forceHidden != true] [0] {
  ${itemFields}
}`;

export const itemListQuery = `*[_type == "item" && defined(slug.current) 
  && defined(publishDate)
  && forceHidden != true
  && sponsor != true]
  | order(coalesce(featured, false) desc, publishDate desc) {
    ${itemSimpleFields}
}`;

export const sponsorItemListQuery = `*[_type == "item" && defined(slug.current) 
  && defined(publishDate)
  && forceHidden != true
  && sponsor == true
  && sponsorStartDate <= now()
  && sponsorEndDate >= now()] 
  | order(coalesce(featured, false) desc, publishDate desc) {
    ${itemSimpleFields}
}`;

export const itemListOfFeaturedQuery = `*[_type == "item" && defined(slug.current) 
  && defined(publishDate) 
  && forceHidden != true 
  && sponsor != true
  && featured == true] 
  | order(coalesce(featured, false) desc, publishDate desc) [0...$count] {
    ${itemSimpleFields}
}`;

export const itemListOfLatestQuery = `*[_type == "item" && defined(slug.current) 
  && defined(publishDate) 
  && forceHidden != true
  && sponsor != true] 
  | order(coalesce(featured, false) desc, publishDate desc) [0...$count] {
    ${itemSimpleFields}
}`;

// ============================================================================
// Category Queries
// ============================================================================

export const categoryListQuery = `*[_type == "category" && defined(slug.current)] 
  | order(priority desc) {
    ${categoryFields}
}`;

export const categoryQuery = `*[_type == "category" && slug.current == $slug][0] {
  ${categoryFields}
}`;

// ============================================================================
// Tag Queries
// ============================================================================

export const tagListQuery = `*[_type == "tag" && defined(slug.current)] 
  | order(slug.current asc) {
    ${tagFields}
}`;

export const tagQuery = `*[_type == "tag" && slug.current == $slug][0] {
  ${tagFields}
}`;

// ============================================================================
// Collection Queries
// ============================================================================

export const collectionListQuery = `*[_type == "collection" && defined(slug.current)] 
  | order(priority desc) {
    ${collectionFields}
}`;

export const collectionQuery = `*[_type == "collection" && slug.current == $slug][0] {
  ${collectionFields}
}`;

// ============================================================================
// Group Queries
// ============================================================================

export const groupListQuery = `*[_type=="group"] | order(priority desc, _createdAt asc) {
  ${groupFields}
}`;

// ============================================================================
// Blog Queries
// ============================================================================

export const blogCategoryListQuery = `
  *[_type == "blogCategory" && defined(slug.current)] 
  | order(priority desc) {
    ${blogCategoryFields}
}`;

export const blogCategoryQuery = `
  *[_type == "blogCategory" && slug.current == $slug][0] {
    ${blogCategoryFields}
  }
`;

export const blogPostQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${blogPostFields}
}`;

export const blogPostListQuery = `
  *[_type == "blogPost" && defined(slug.current) && defined(publishDate)] 
  | order(publishDate desc) {
    ${blogPostSimpleFields}
}`;

export const blogPostListOfLatestQuery = `
  *[_type == "blogPost" && defined(slug.current) && defined(publishDate)] 
  | order(publishDate desc) [0...$count] {
    ${blogPostSimpleFields}
}`;

// ============================================================================
// User Queries
// ============================================================================

export const userByIdQuery = `*[_type == "user" && _id == $id][0] {
  ...
}`;

export const userByEmailQuery = `*[_type == "user" && email == $email][0] {
  ...
}`;

export const userWithAccountsQuery = `
  *[_type == "user" && _id == $id][0] {
    ...,
    accounts[]->,
  }
`;

// ============================================================================
// Submission Queries
// ============================================================================

export const submissionListQuery = `*[_type == "item" && defined(slug.current)
  && submitter._ref == $userId] 
  | order(_createdAt desc) {
    ${itemSimpleFields}
}`;
