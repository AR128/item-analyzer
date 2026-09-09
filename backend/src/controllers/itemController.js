import { identifyItem } from "../services/geminiService.js";
import { findRuleForItem } from "../services/rulesService.js";

export async function analyseItem(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No Image provided" });
    const identification = await identifyItem(
      req.file.buffer,
      req.file.mimetype,
    );
    const rule = await findRuleForItem(identification.item);
    if (!rule) {
      return res.json({
        item: identification.item,
        category: identification.category,
        confidence: identification.confidence,
        status: "UNKNOWN",
        reason: "No Railway Rule found for this item.",
        conditions: "No additional conditions available.",
      });
    }
    return res.json({
      item: rule.item,
      category: rule.category,
      confidence: identification.confidence,
      status: rule.status,
      reason: rule.reason,
      conditions: rule.conditions,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
