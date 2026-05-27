"use client";
import type { Table } from "@/generated/prisma/client";
import { Link } from "@/i18n/navigation";
import { Locale, useFormatter, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { motion, useAnimate } from "motion/react";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export default function Table({ table }: { table: Table }) {
  const format = useFormatter();
  const [scope, animate] = useAnimate();
  const [isDropMenuOpen, setIsDropMenuOpen] = useState(false);
  const router = useRouter();

  const translations = useTranslations("TablePage");

  const changeLocale = (locale: Locale) => {
    router.replace(`/table/${table.id}`, { locale });
    toggleDropMenu();
  };

  const toggleDropMenu = () => {
    if (isDropMenuOpen) {
      animate(scope.current, { opacity: 0, scale: 0.8 }, { duration: 0.2 }).finished.then(
        () => {
          scope.current.classList.add("hidden");
          scope.current.classList.remove("flex");
        },
      );
      setIsDropMenuOpen(false);
    } else {
      scope.current.classList.remove("hidden");
      scope.current.classList.add("flex");
      animate(scope.current, { opacity: 1, scale: 1 }, { duration: 0.2 });
      setIsDropMenuOpen(true);
    }
  };

  return (
    <div>
      <nav className="flex items-center justify-between p-5">
        <motion.h1
          whileTap={{ scale: 0.9 }}
          className="text-xl font-bold bg-(--primary) text-foreground px-3 py-2 rounded-xl"
        >
          {translations("title", {
            table: format.number(table.number),
          })}
        </motion.h1>

        <div className="flex items-center justify-between">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Link
              href={`/checkOut/${table.id}`}
              className="p-2 m-2 bg-(--primary) text-foreground rounded-xl font-bold"
            >
              {translations("payButton")}
            </Link>
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 m-2 bg-(--primary) text-foreground rounded-xl cursor-pointer"
            onClick={toggleDropMenu}
          >
            <Globe />
          </motion.button>

          <motion.div
            ref={scope}
            initial={{ opacity: 0, scale: 0.8 }}
            className="absolute top-20 right-5 bg-(--primary) text-foreground rounded-xl p-2 flex-col gap-2"
          >
            <motion.button
              className="m-1 p-1 cursor-pointer"
              onClick={() => changeLocale("en")}
            >
              English
            </motion.button>
            <motion.button
              className="m-1 p-1 cursor-pointer"
              onClick={() => changeLocale("fa")}
            >
              فارسی
            </motion.button>
          </motion.div>
        </div>
      </nav>
    </div>
  );
}
