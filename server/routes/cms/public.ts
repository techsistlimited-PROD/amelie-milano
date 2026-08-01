import { Router, type Request, type Response } from "express";
import {
  cmsConfigured,
  cmsTables,
  getByField,
  listVisibleRows,
  mapCollection,
  mapEditorial,
  mapPage,
  mapProduct,
  mapRow,
  mapRows,
  mapSection,
} from "../../lib/cmsDb";

export const cmsPublicRouter = Router();

cmsPublicRouter.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

const unavailable = (res: Response) => res.status(503).json({ message: "CMS is not configured." });

cmsPublicRouter.get("/status", (_req, res) => {
  res.json({ configured: cmsConfigured(), source: "amelie-cms" });
});

cmsPublicRouter.get("/products", async (_req, res) => {
  if (!cmsConfigured()) return unavailable(res);
  try {
    const rows = await listVisibleRows(cmsTables.products);
    res.json(rows.map(mapProduct));
  } catch {
    res.status(503).json({ message: "Unable to load products." });
  }
});

cmsPublicRouter.get("/products/:slug", async (req, res) => {
  if (!cmsConfigured()) return unavailable(res);
  try {
    const row = await getByField(cmsTables.products, "slug", req.params.slug);
    if (!row || row.is_visible === false) {
      res.status(404).json({ message: "Product not found." });
      return;
    }
    res.json(mapProduct(row));
  } catch {
    res.status(503).json({ message: "Unable to load product." });
  }
});

cmsPublicRouter.get("/collections", async (_req, res) => {
  if (!cmsConfigured()) return unavailable(res);
  try {
    const rows = await listVisibleRows(cmsTables.collections);
    res.json(rows.map(mapCollection));
  } catch {
    res.status(503).json({ message: "Unable to load collections." });
  }
});

cmsPublicRouter.get("/collections/:slug", async (req, res) => {
  if (!cmsConfigured()) return unavailable(res);
  try {
    const row = await getByField(cmsTables.collections, "slug", req.params.slug);
    if (!row || row.is_visible === false) {
      res.status(404).json({ message: "Collection not found." });
      return;
    }
    res.json(mapCollection(row));
  } catch {
    res.status(503).json({ message: "Unable to load collection." });
  }
});

cmsPublicRouter.get("/editorials", async (_req, res) => {
  if (!cmsConfigured()) return unavailable(res);
  try {
    const rows = await listVisibleRows(cmsTables.editorials, "display_order.asc");
    res.json(rows.map(mapEditorial));
  } catch {
    res.status(503).json({ message: "Unable to load editorials." });
  }
});

cmsPublicRouter.get("/editorials/:slug", async (req, res) => {
  if (!cmsConfigured()) return unavailable(res);
  try {
    const row = await getByField(cmsTables.editorials, "slug", req.params.slug);
    if (!row || row.is_visible === false) {
      res.status(404).json({ message: "Editorial not found." });
      return;
    }
    res.json(mapEditorial(row));
  } catch {
    res.status(503).json({ message: "Unable to load editorial." });
  }
});

cmsPublicRouter.get("/sections", async (_req, res) => {
  if (!cmsConfigured()) return unavailable(res);
  try {
    const rows = await listVisibleRows(cmsTables.sections, "display_order.asc");
    res.json(rows.map(mapSection));
  } catch {
    res.status(503).json({ message: "Unable to load sections." });
  }
});

cmsPublicRouter.get("/pages", async (req, res) => {
  if (!cmsConfigured()) return unavailable(res);
  const path = String(req.query.path || "/");
  try {
    const row = await getByField(cmsTables.pages, "path", path);
    if (!row || row.is_visible === false) {
      res.status(404).json({ message: "Page not found." });
      return;
    }
    res.json(mapPage(row));
  } catch {
    res.status(503).json({ message: "Unable to load page." });
  }
});

cmsPublicRouter.get("/faq", async (_req, res) => {
  if (!cmsConfigured()) return unavailable(res);
  try {
    const rows = await listVisibleRows(cmsTables.faq, "display_order.asc");
    res.json(mapRows(rows));
  } catch {
    res.status(503).json({ message: "Unable to load FAQ." });
  }
});
