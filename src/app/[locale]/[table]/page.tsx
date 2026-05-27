import prisma from "@/libs/prisma";
import { notFound } from "next/navigation";
import Table from "@/components/Table";
import { getTranslations } from "next-intl/server";

export default async function TablePage({ params }: PageProps<"/[locale]/[table]">) {
  const { locale, table } = await params;
  const t = await getTranslations("TablePage");

  const tableExists =
    (
      await prisma.table.findMany({
        select: {
          number: true,
        },
        where: {
          number: parseInt(table),
        },
      })
    ).length > 0;

  return tableExists ? <Table translations={t} table={parseInt(table)} /> : notFound();
}
