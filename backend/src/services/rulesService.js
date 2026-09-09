import { eq } from "drizzle-orm";
import { itemAliases, items, rules } from "../db/schema.js";
import { db } from "../db/index.js";

function normalizeItemName(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, " ");
}

export async function findRuleForItem(itemName) {
  const name = normalizeItemName(itemName);
  if (!name) return null;

  let item = await db.query.items.findFirst({
    where: eq(items.name, name.replace(/\s+/g, "_")),
  });

  if (!item) {
    const aliasMatch = await db.query.itemAliases.findFirst({
      where: eq(itemAliases.alias, name),
    });

    if (!aliasMatch) return null;

    item = await db.query.items.findFirst({
      where: eq(items.id, aliasMatch.itemId),
    });
  }

  if (!item) return null;

  const rule = await db.query.rules.findFirst({
    where: eq(rules.itemId, item.id),
  });

  if (!rule) return null;

  return {
    item: item.name,
    category: item.category,
    status: rule.status,
    reason: rule.reason,
    conditions: rule.conditions,
  };
}
