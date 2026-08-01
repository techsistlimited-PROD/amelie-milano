/**
 * Content facade — Amelie CMS (Supabase) replaces Builder.io.
 * Pages import from here; implementation lives in cms.ts.
 */
export type {
  CmsProduct as BuilderProductData,
  CmsCollection as BuilderCollectionData,
  CmsSiteSection as BuilderSiteSectionData,
  CmsSiteSectionItem as BuilderSiteSectionItem,
  CmsEditorial as BuilderEditorialData,
} from "./cms";

export {
  checkCmsStatus,
  ensureCmsReady,
  isCmsConfigured as isBuilderConfigured,
  fetchCmsProducts as fetchBuilderProducts,
  fetchCmsProduct as fetchBuilderProduct,
  fetchCmsCollection as fetchBuilderCollection,
  fetchCmsEditorials as fetchBuilderEditorials,
  fetchCmsEditorial as fetchBuilderEditorial,
  fetchCmsSiteSections as fetchBuilderSiteSections,
  fetchCmsPage as fetchBuilderPage,
  fetchCmsFaq as fetchBuilderFaq,
} from "./cms";

// Legacy constant — no longer used
export const BUILDER_API_KEY = "";
