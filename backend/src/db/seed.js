import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index.js";
import { items, itemAliases, rules } from "./schema.js";

const data = [
  {
    item: "uranium",
    category: "radioactive_material",
    aliases: ["uranium", "uranium metal", "radioactive uranium"],
    status: "PROHIBITED",
    reason: "Radio-active materials prohibited as parcel traffic",
    conditions:
      "Cannot be booked or carried on any passenger or parcel trains under standard railway regulations.",
  },

  {
    item: "uranium_concentrate",
    category: "radioactive_material",
    aliases: ["uranium concentrate", "uranium ore concentrate"],
    status: "PROHIBITED",
    reason: "Radio-active materials prohibited as parcel traffic",
    conditions:
      "Cannot be booked or carried on any passenger or parcel trains under standard railway regulations.",
  },

  {
    item: "thorium",
    category: "radioactive_material",
    aliases: ["thorium", "thorium metal", "radioactive thorium"],
    status: "PROHIBITED",
    reason: "Radio-active materials prohibited as parcel traffic",
    conditions:
      "Cannot be booked or carried on any passenger or parcel trains under standard railway regulations.",
  },

  {
    item: "thorium_nitrate",
    category: "radioactive_material",
    aliases: ["thorium nitrate"],
    status: "PROHIBITED",
    reason: "Radio-active materials prohibited as parcel traffic",
    conditions:
      "Cannot be booked or carried on any passenger or parcel trains under standard railway regulations.",
  },

  {
    item: "thorium_oxide",
    category: "radioactive_material",
    aliases: ["thorium oxide"],
    status: "PROHIBITED",
    reason: "Radio-active materials prohibited as parcel traffic",
    conditions:
      "Cannot be booked or carried on any passenger or parcel trains under standard railway regulations.",
  },

  {
    item: "heavy_water",
    category: "radioactive_material",
    aliases: ["heavy water", "deuterium oxide", "d2o"],
    status: "PROHIBITED",
    reason: "Radio-active materials prohibited as parcel traffic",
    conditions:
      "Cannot be booked or carried on any passenger or parcel trains under standard railway regulations.",
  },

  {
    item: "acids",
    category: "corrosive_substances",
    aliases: ["acid", "acids", "corrosive acid", "corrosive acids"],
    status: "PROHIBITED",
    reason: "Corrosive substances as provided in Red tariff",
    conditions:
      "Requires specialized transport authorization and compliance under the specific provisions of the Red Tariff.",
  },

  {
    item: "corrosive_substances",
    category: "corrosive_substances",
    aliases: [
      "corrosive substance",
      "corrosive substances",
      "corrosive material",
      "corrosive materials",
    ],
    status: "PROHIBITED",
    reason: "Corrosive substances as provided in Red tariff",
    conditions:
      "Requires specialized transport authorization and compliance under the specific provisions of the Red Tariff.",
  },

  {
    item: "wet_skins",
    category: "offensive_articles",
    aliases: ["wet skins", "wet animal skins", "wet hides", "animal hides"],
    status: "PROHIBITED",
    reason:
      "Offensive articles except wet skins of wild animals securely packed in air-tight boxes at Owner's Risk",
    conditions:
      "Permitted exclusively for wild animals if securely packed in air-tight boxes and declared at Owner's Risk.",
  },

  {
    item: "dried_blood",
    category: "offensive_goods",
    aliases: ["dried blood", "dry blood", "blood"],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Strictly barred from passenger compartments, brake vans, and parcel offices.",
  },

  {
    item: "dead_bodies",
    category: "offensive_goods",
    aliases: ["dead body", "dead bodies", "human corpse", "corpse"],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Subject to separate, specialized medical certificate and mortuary transport rules; excluded from standard luggage.",
  },

  {
    item: "carcasses_of_dead_animals",
    category: "offensive_goods",
    aliases: [
      "animal carcass",
      "animal carcasses",
      "dead animal",
      "dead animals",
      "animal remains",
    ],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Strictly barred from passenger compartments, brake vans, and parcel offices.",
  },

  {
    item: "bones_excluding_bleached_and_cleaned_bones",
    category: "offensive_goods",
    aliases: ["bones", "animal bones", "unclean bones", "unbleached bones"],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Permitted only if fully sanitized, bleached, cleaned, and properly packaged.",
  },

  {
    item: "municipal_or_street_sweepings_or_refuse",
    category: "offensive_goods",
    aliases: [
      "street sweepings",
      "street waste",
      "municipal waste",
      "refuse",
      "garbage",
      "sweepings",
    ],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Strictly barred from passenger compartments, brake vans, and parcel offices.",
  },

  {
    item: "manures_of_any_kind_except_chemical_manures",
    category: "offensive_goods",
    aliases: [
      "manure",
      "manures",
      "animal manure",
      "farm manure",
      "organic manure",
    ],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Permitted only if manufactured and packaged as commercial chemical fertilizers.",
  },

  {
    item: "rags_other_than_oily_rags",
    category: "offensive_goods",
    aliases: ["rags", "rag", "old rags", "used cloth"],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Permitted only when meeting specific industrial non-hazardous packaging criteria.",
  },

  {
    item: "decayed_animal_or_vegetable_matter",
    category: "offensive_goods",
    aliases: [
      "decayed matter",
      "decayed animal matter",
      "decayed vegetable matter",
      "rotting organic matter",
      "decomposed matter",
    ],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Strictly barred from passenger compartments, brake vans, and parcel offices.",
  },

  {
    item: "human_ashes",
    category: "offensive_goods",
    aliases: ["human ashes", "ashes", "cremation ashes", "cremated remains"],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Requires official clearance certificates and sealed urn containers for special booking.",
  },

  {
    item: "human_skeleton",
    category: "offensive_goods",
    aliases: ["human skeleton", "skeleton", "human bones"],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Requires legal and medical documentation for specialized transport approval.",
  },

  {
    item: "parts_of_human_body",
    category: "offensive_goods",
    aliases: [
      "human body parts",
      "parts of human body",
      "human remains",
      "body parts",
    ],
    status: "PROHIBITED",
    reason: "Offensive goods",
    conditions:
      "Strictly barred from passenger compartments, brake vans, and parcel offices.",
  },

  {
    item: "explosives",
    category: "dangerous_goods",
    aliases: [
      "explosive",
      "explosives",
      "explosive material",
      "explosive materials",
      "dynamite",
      "dynamite sticks",
    ],
    status: "PROHIBITED",
    reason: "Explosives, dangerous, inflammable articles",
    conditions:
      "Subject to strict statutory penalties; zero tolerance for carriage in passenger trains.",
  },

  {
    item: "dangerous_articles",
    category: "dangerous_goods",
    aliases: [
      "dangerous article",
      "dangerous articles",
      "dangerous goods",
      "hazardous goods",
      "hazardous material",
    ],
    status: "PROHIBITED",
    reason: "Explosives, dangerous, inflammable articles",
    conditions:
      "Subject to strict statutory penalties; zero tolerance for carriage in passenger trains.",
  },

  {
    item: "inflammable_articles",
    category: "dangerous_goods",
    aliases: [
      "inflammable article",
      "inflammable articles",
      "flammable article",
      "flammable articles",
      "flammable material",
      "flammable materials",
    ],
    status: "PROHIBITED",
    reason: "Explosives, dangerous, inflammable articles",
    conditions:
      "Subject to strict statutory penalties; zero tolerance for carriage in passenger trains.",
  },

  {
    item: "articles_exceeding_280_cubic_decimeters",
    category: "bulky_articles",
    aliases: [
      "oversized article",
      "oversized item",
      "bulky item",
      "bulky article",
      "large luggage",
    ],
    status: "PROHIBITED",
    reason: "Exceeding 280 cubic decimeters size limit",
    conditions:
      "Must be booked at luggage office at least 30 min before departure and loaded in brake van; levied at double normal rate if dimensions exceed prescribed limits by >10% or weight >100 kg.",
  },

  {
    item: "oil",
    category: "restricted_luggage",
    aliases: ["oil", "cooking oil", "edible oil", "oil container"],
    status: "PROHIBITED",
    reason: "Prohibited item for luggage carriage",
    conditions:
      "May only be carried via authorized parcel booking with leak-proof industrial containers.",
  },

  {
    item: "paint",
    category: "restricted_luggage",
    aliases: ["paint", "paints", "paint container", "paint can"],
    status: "PROHIBITED",
    reason: "Prohibited item for luggage carriage",
    conditions:
      "May only be carried via authorized parcel booking with leak-proof industrial containers.",
  },

  {
    item: "ghee",
    category: "restricted_luggage",
    aliases: ["ghee", "clarified butter", "ghee container"],
    status: "PROHIBITED",
    reason: "Prohibited item for luggage carriage",
    conditions:
      "May only be carried via authorized parcel booking with leak-proof industrial containers.",
  },

  {
    item: "grease",
    category: "restricted_luggage",
    aliases: ["grease", "lubricating grease", "machine grease"],
    status: "PROHIBITED",
    reason: "Prohibited item for luggage carriage",
    conditions:
      "May only be carried via authorized parcel booking with leak-proof industrial containers.",
  },

  {
    item: "dry_grass_and_leaves",
    category: "restricted_luggage",
    aliases: [
      "dry grass",
      "dry leaves",
      "dry grass and leaves",
      "dried grass",
      "dried leaves",
      "hay",
    ],
    status: "PROHIBITED",
    reason: "Prohibited item for luggage carriage",
    conditions:
      "May only be transported in full wagon loads under specific fire safety regulations.",
  },

  {
    item: "waste_paper",
    category: "restricted_luggage",
    aliases: ["waste paper", "paper waste", "scrap paper", "old paper"],
    status: "PROHIBITED",
    reason: "Prohibited item for luggage carriage",
    conditions:
      "May only be transported in full wagon loads under specific fire safety regulations.",
  },

  {
    item: "dead_poultry",
    category: "restricted_luggage",
    aliases: [
      "dead poultry",
      "dead chicken",
      "dead hen",
      "dead bird",
      "poultry carcass",
    ],
    status: "PROHIBITED",
    reason: "Prohibited item for luggage carriage",
    conditions:
      "Strictly barred from passenger compartments, brake vans, and parcel offices.",
  },

  {
    item: "dog",
    category: "animals",
    aliases: ["dog", "dogs", "pet dog", "domestic dog", "puppy", "puppies"],
    status: "CONDITIONAL",
    reason:
      "Dogs are not allowed to be carried in AC 2 Tier, Chair Car, and II Class Compartments; only permitted in AC Class or I Class with concurrence of fellow passengers or in Guard's van",
    conditions:
      "Must be prepaid, equipped with collars/chains, and provided food/water by owner. Carried in brake-van (30 kg rate) or AC 1st/1st Class (60 kg rate) with passenger consent. Unbooked detection incurs 6x scale penalty (min Rs 50).",
  },

  {
    item: "trunks_and_suitcases_exceeding_dimensions",
    category: "bulky_articles",
    aliases: [
      "oversized trunk",
      "oversized suitcase",
      "large trunk",
      "large suitcase",
      "oversized box",
      "suitcase"
    ],
    status: "CONDITIONAL",
    reason:
      "Exceeds standard compartment dimensions limit (100 cm x 60 cm x 25 cm)",
    conditions:
      "Prohibited inside AC 3 Tier and AC Chair Car compartments if exceeding 100cm x 60cm x 25cm. Must be booked in advance at the luggage office and carried in the brake van (SLR).",
  },

  {
    item: "bicycle",
    category: "vehicles_and_equipment",
    aliases: ["bicycle", "bicycles", "cycle", "push bike", "tricycle"],
    status: "CONDITIONAL",
    reason:
      "Bulky non-personal compartment article requiring brake van booking",
    conditions:
      "Must be booked in advance at the station luggage office; carried exclusively in the brake van at standard fixed parcel/luggage scale rates. Must be properly tagged and padded.",
  },

  {
    item: "motorcycle_and_scooter",
    category: "vehicles_and_equipment",
    aliases: [
      "motorcycle",
      "scooter",
      "two wheeler",
      "motorbike",
      "moped",
      "scooty",
    ],
    status: "CONDITIONAL",
    reason:
      "Flammable fluid hazard if unemptied; oversized item for passenger coaches",
    conditions:
      "Fuel tank must be completely emptied and drained prior to booking. Carried exclusively as luggage/parcel in the brake van with a valid registration certificate (RC) and ID copy.",
  },

  {
    item: "small_birds_and_small_animals",
    category: "animals",
    aliases: [
      "pet bird",
      "pet birds",
      "cage birds",
      "small pets",
      "puppies in cage",
      "kittens",
    ],
    status: "CONDITIONAL",
    reason: "Restricted live animal carriage rules",
    conditions:
      "Permitted for carriage in the brake van inside secure containers/cages at standard luggage rates. Primary responsibility for feeding and watering remains with the owner/passenger.",
  },

  {
    item: "television_and_electronic_appliances",
    category: "electronic_goods",
    aliases: [
      "tv",
      "television",
      "led tv",
      "lcd tv",
      "monitor",
      "washing machine",
      "refrigerator",
    ],
    status: "CONDITIONAL",
    reason: "Fragile and high-volume bulky merchandise",
    conditions:
      "Permitted in compartments only within free weight allowance and prescribed size limits. Larger sets exceeding compartment limits must be securely packed and booked in the brake van at Owner's Risk.",
  },

  {
    item: "merchandise_and_commercial_samples",
    category: "commercial_goods",
    aliases: [
      "trade samples",
      "commercial goods",
      "sales samples",
      "merchandise boxes",
      "bulk goods",
    ],
    status: "CONDITIONAL",
    reason: "Exceeds personal luggage allowance scope",
    conditions:
      "Cannot be carried as personal free allowance luggage. Must be declared and charged under commercial parcel/luggage rates at the luggage booking counter.",
  },

  {
    item: "gold_and_silver_bullion",
    category: "valuable_articles",
    aliases: [
      "gold",
      "silver",
      "bullion",
      "precious metals",
      "jewelry",
      "jewellery",
    ],
    status: "CONDITIONAL",
    reason: "High-value articles subject to special security declaration",
    conditions:
      "Must be declared with value specified at the time of booking. Subject to payment of special value charges/surcharges and escort/verification conditions under railway rules.",
  },

  {
    item: "compressed_gas_cylinders",
    category: "dangerous_goods",
    aliases: [
      "gas cylinder",
      "lpg cylinder",
      "oxygen cylinder",
      "compressed gas",
      "cooking gas cylinder",
    ],
    status: "PROHIBITED",
    reason: "Explosives, dangerous, inflammable articles",
    conditions:
      "Strictly prohibited in passenger compartments, brake vans, and parcel booking due to fire and explosion hazards under railway safety acts.",
  },

  {
    item: "fireworks_and_crackers",
    category: "dangerous_goods",
    aliases: [
      "fireworks",
      "crackers",
      "firecrackers",
      "pyrotechnics",
      "sparklers",
    ],
    status: "PROHIBITED",
    reason: "Explosives, dangerous, inflammable articles",
    conditions:
      "Carrying fireworks or firecrackers in passenger coaches or luggage is a punishable offense with imprisonment and severe financial penalties.",
  },

  {
    item: "kerosene_and_petrol",
    category: "dangerous_goods",
    aliases: [
      "kerosene",
      "petrol",
      "diesel",
      "fuel",
      "inflammable liquid",
      "motor spirit",
    ],
    status: "PROHIBITED",
    reason: "Explosives, dangerous, inflammable articles",
    conditions:
      "Liquid fuels with low flashpoints are strictly barred from being carried as personal luggage or parcel traffic on passenger trains.",
  },

  {
    item: "horses_and_cattle",
    category: "animals",
    aliases: ["horse", "horses", "cattle", "cow", "bull", "livestock"],
    status: "CONDITIONAL",
    reason: "Large animal transportation requiring dedicated stock cars",
    conditions:
      "Cannot be carried as standard luggage or in general brake vans. Must be booked in special horse boxes or full cattle wagons with attendant tickets and veterinary certificates.",
  },

  {
    item: "fresh_fish_and_meat",
    category: "perishable_goods",
    aliases: [
      "fresh fish",
      "raw meat",
      "fish parcel",
      "seafood",
      "mutton",
      "chicken meat",
    ],
    status: "CONDITIONAL",
    reason: "Perishable items prone to leakage and decay",
    conditions:
      "Permitted only via parcel booking in leak-proof, insulated, or ice-packed containers. Strictly forbidden inside passenger coach compartments.",
  },

  {
    item: "firearms_and_ammunition",
    category: "restricted_weaponry",
    aliases: [
      "firearm",
      "gun",
      "revolver",
      "rifle",
      "ammunition",
      "bullets",
      "pistol",
    ],
    status: "CONDITIONAL",
    reason: "Regulated hazardous security items",
    conditions:
      "Allowed for personal carriage only by licensed arms holders with valid gun license documentation, provided firearms are unloaded and carried safely.",
  },
];
async function seed() {
  try {
    console.log("Starting database seed...");

    // Reset all seeded tables and their serial sequences so IDs start from 1 again.
    await db.execute(
      sql`TRUNCATE TABLE item_aliases, rules, items RESTART IDENTITY CASCADE;`,
    );

    // --------------------------------------------------
    // 1. Insert items
    // --------------------------------------------------

    const insertedItems = await db
      .insert(items)
      .values(
        data.map((item) => ({
          name: item.item,
          category: item.category,
        })),
      )
      .returning();

    console.log(`Inserted ${insertedItems.length} items.`);

    // --------------------------------------------------
    // 2. Insert aliases
    // --------------------------------------------------

    const aliasData = [];

    for (const insertedItem of insertedItems) {
      const originalItem = data.find(
        (dataItem) => dataItem.item === insertedItem.name,
      );

      for (const alias of originalItem.aliases) {
        aliasData.push({
          itemId: insertedItem.id,
          alias: alias.toLowerCase().trim(),
        });
      }
    }

    if (aliasData.length > 0) {
      await db.insert(itemAliases).values(aliasData);
    }

    console.log(`Inserted ${aliasData.length} aliases.`);

    // --------------------------------------------------
    // 3. Insert rules
    // --------------------------------------------------

    const ruleData = insertedItems.map((item) => {
      const originalData = data.find((dataItem) => dataItem.item === item.name);

      return {
        itemId: item.id,
        status: originalData.status,
        reason: originalData.reason,
        conditions: originalData.conditions,
      };
    });

    await db.insert(rules).values(ruleData);

    console.log(`Inserted ${ruleData.length} rules.`);
    console.log("Database seed completed successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Database seed failed:");
    console.error(error);

    process.exit(1);
  }
}

seed();
