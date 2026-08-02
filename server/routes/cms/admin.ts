import { Router } from "express";
import { handleAdminMe, requireAdmin } from "../../middleware/requireAdmin";
import {
  cmsConfigured,
  cmsTables,
  deleteRow,
  insertRow,
  listRows,
  mapRow,
  mapRows,
  updateRow,
} from "../../lib/cmsDb";

const tableConfig = {
  products: { table: cmsTables.products, slugField: "slug" },
  collections: { table: cmsTables.collections, slugField: "slug" },
  editorials: { table: cmsTables.editorials, slugField: "slug" },
  sections: { table: cmsTables.sections, slugField: "section_key" },
  pages: { table: cmsTables.pages, slugField: "path" },
  faq: { table: cmsTables.faq, slugField: "id" },
} as const;

type Resource = keyof typeof tableConfig;

export const cmsAdminRouter = Router();

cmsAdminRouter.use(requireAdmin);

cmsAdminRouter.get("/me", handleAdminMe);

cmsAdminRouter.get("/:resource", async (req, res) => {
  const resource = req.params.resource as Resource;
  const config = tableConfig[resource];
  if (!config || !cmsConfigured()) {
    res.status(404).json({ message: "Unknown resource." });
    return;
  }
  try {
    const rows = await listRows(config.table, resource === "pages" ? "path.asc" : "display_order.asc");
    res.json(mapRows(rows));
  } catch (error) {
    res.status(503).json({ message: error instanceof Error ? error.message : "Unable to load records." });
  }
});

cmsAdminRouter.post("/:resource", async (req, res) => {
  const resource = req.params.resource as Resource;
  if (resource === "collections") {
    res.status(403).json({ message: "Shop pages are fixed — edit an existing page instead." });
    return;
  }
  const config = tableConfig[resource];
  if (!config || !cmsConfigured()) {
    res.status(404).json({ message: "Unknown resource." });
    return;
  }
  try {
    const row = await insertRow(config.table, req.body ?? {});
    res.status(201).json(mapRow(row ?? {}));
  } catch (error) {
    res.status(503).json({ message: error instanceof Error ? error.message : "Unable to create record." });
  }
});

cmsAdminRouter.put("/:resource/:id", async (req, res) => {
  const resource = req.params.resource as Resource;
  const config = tableConfig[resource];
  if (!config || !cmsConfigured()) {
    res.status(404).json({ message: "Unknown resource." });
    return;
  }
  try {
    const row = await updateRow(config.table, req.params.id, req.body ?? {});
    res.json(mapRow(row ?? {}));
  } catch (error) {
    res.status(503).json({ message: error instanceof Error ? error.message : "Unable to update record." });
  }
});

cmsAdminRouter.delete("/:resource/:id", async (req, res) => {
  const resource = req.params.resource as Resource;
  if (resource === "collections") {
    res.status(403).json({ message: "Shop pages cannot be deleted." });
    return;
  }
  const config = tableConfig[resource];
  if (!config || !cmsConfigured()) {
    res.status(404).json({ message: "Unknown resource." });
    return;
  }
  try {
    await deleteRow(config.table, req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(503).json({ message: error instanceof Error ? error.message : "Unable to delete record." });
  }
});
