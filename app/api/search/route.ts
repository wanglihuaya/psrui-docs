import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

export const { GET } = createFromSource(source, {
  localeMap: {
    // Orama does not ship a native zh tokenizer. Use the English tokenizer as
    // a stable fallback so Chinese-locale pages remain searchable for mixed
    // ASCII terms such as command names and file extensions.
    zh: "english",
  },
});
