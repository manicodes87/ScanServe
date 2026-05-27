import type { _Translator } from "next-intl";
import { useFormatter } from "next-intl";

export default function Table({
  translations,
  table,
}: {
  translations: _Translator<
    {
      Metadata: {
        title: string;
        description: string;
      };
      IndexPage: {
        title: string;
      };
      TablePage: {
        title: string;
      };
    },
    "TablePage"
  >;
  table: number;
}) {
  const format = useFormatter();

  return (
    <div>
      {translations("title", {
        table: format.number(table),
      })}
    </div>
  );
}
