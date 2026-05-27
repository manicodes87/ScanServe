import prisma from "@/libs/prisma";
import { notFound } from "next/navigation";
import Table from "@/components/Table";
import { getTranslations } from "next-intl/server";

export default async function TablePage({
  params,
}: PageProps<"/[locale]/table/[tableId]">) {
  const { locale, tableId } = await params;
  const t = await getTranslations("TablePage");

  console.log(tableId);

  const table = await prisma.table.findMany({
    where: {
      id: tableId,
    },
  });

  const tableExists = table.length > 0;

  return tableExists ? <Table translations={t} table={table[0]} /> : notFound();
}
