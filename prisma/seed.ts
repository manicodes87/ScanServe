import {
  PrismaClient,
  ItemCategory,
  OrderStatus,
  Prisma,
} from "@/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// =========================
// DATA LAYERS
// =========================

const menuData: Prisma.MenuCreateInput[] = [
  {
    name: "Main Menu",
    slug: "main-menu",
    menuTranslations: {
      create: [
        { language: "en", name: "Main Menu" },
        { language: "fa", name: "منوی اصلی" },
      ],
    },
  },
  {
    name: "Drinks Menu",
    slug: "drinks-menu",
    menuTranslations: {
      create: [
        { language: "en", name: "Drinks Menu" },
        { language: "fa", name: "منوی نوشیدنی‌ها" },
      ],
    },
  },
];

const menuItemData = (menuIds: {
  main: string;
  drinks: string;
}): Prisma.MenuItemCreateInput[] => [
  {
    name: "Burger",
    slug: "burger",
    price: 29.99,
    category: ItemCategory.MAIN_COURSE,
    menu: { connect: { id: menuIds.main } },
    menuItemTranslations: {
      create: [
        { language: "en", name: "Burger", description: "Juicy beef burger" },
        { language: "fa", name: "برگر", description: "برگر گوشت آبدار" },
      ],
    },
  },
  {
    name: "Fries",
    slug: "fries",
    price: 12.99,
    category: ItemCategory.SIDE_DISH,
    menu: { connect: { id: menuIds.main } },
    menuItemTranslations: {
      create: [
        { language: "en", name: "Fries", description: "Crispy fries" },
        { language: "fa", name: "سیب‌زمینی سرخ‌کرده", description: "سیب‌زمینی ترد" },
      ],
    },
  },
  {
    name: "Cola",
    slug: "cola",
    price: 9.99,
    category: ItemCategory.DRINK,
    menu: { connect: { id: menuIds.drinks } },
    menuItemTranslations: {
      create: [
        { language: "en", name: "Cola", description: "Cold drink" },
        { language: "fa", name: "کولا", description: "نوشیدنی خنک" },
      ],
    },
  },
];

const tableData: Prisma.TableCreateInput[] = [
  { number: 1, available: false },
  { number: 2, available: true },
  { number: 3, available: true },
];

// =========================
// MAIN
// =========================

export async function main() {
  // -------------------------
  // MENUS
  // -------------------------
  const menus = [];

  for (const m of menuData) {
    const created = await prisma.menu.create({ data: m });
    menus.push(created);
  }

  const menuIds = {
    main: menus[0].id,
    drinks: menus[1].id,
  };

  // -------------------------
  // MENU ITEMS
  // -------------------------
  const items = [];

  for (const item of menuItemData(menuIds)) {
    const created = await prisma.menuItem.create({ data: item });
    items.push(created);
  }

  // -------------------------
  // TABLES
  // -------------------------
  const tables = [];

  for (const t of tableData) {
    const created = await prisma.table.create({ data: t });
    tables.push(created);
  }

  const table1 = tables[0];

  // -------------------------
  // ORDERS
  // -------------------------
  const order = await prisma.order.create({
    data: {
      total: 52.98,
      status: OrderStatus.PENDING,
      table: { connect: { id: table1.id } },
    },
  });

  // -------------------------
  // ORDER ITEMS
  // -------------------------
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        menuItemId: items[0].id,
        quantity: 1,
      },
      {
        orderId: order.id,
        menuItemId: items[1].id,
        quantity: 1,
      },
      {
        orderId: order.id,
        menuItemId: items[2].id,
        quantity: 2,
      },
    ],
  });

  console.log("🌱 Seed completed successfully");
}

// run
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
