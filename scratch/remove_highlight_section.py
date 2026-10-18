import re

path = 'src/routes/products.$category.index.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace lucide-react imports
new_imports = """import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PhoneCall, ShieldCheck } from "lucide-react";"""

content = re.sub(r'import \{ createFileRoute, Link, notFound \} from "@tanstack/react-router";\s*import \{ motion \} from "framer-motion";\s*import \{[^}]*\} from "lucide-react";', new_imports, content)

# 2. Remove type HighlightBadge and categoryHighlights
content = re.sub(r'type HighlightBadge = \{[^}]*\};\s*const categoryHighlights: Record<string, HighlightBadge\[\]> = \{[\s\S]*?\n\};\n', '', content)

# 3. Remove const badges = categoryHighlights[c.slug] || categoryHighlights["agriculture"];
content = re.sub(r'\s*const badges = categoryHighlights\[c\.slug\] \|\| categoryHighlights\["agriculture"\];\n', '\n', content)

# 4. Replace Section 3 (the 4 badges strip) with just PowderSwatchStrip when isDehydrated
old_section_3 = r'\{\/\* 3\. Export-Grade Highlight Strip \(4 Badges Relevant to Category\) \*\/\}[\s\S]*?\{\/\* 4\. Dehydration Process Timeline \(Powders Only\) \*\/\}\n\s*\{isDehydrated && \('

new_section_3 = """{/* 3. Powder Swatch Strip for Dehydrated Powders Only */}
      {isDehydrated && (
        <section className="border-b border-[#C9973F]/25 bg-[#071A33] py-8 text-white relative overflow-hidden">
          <div className="container-x">
            <PowderSwatchStrip products={c.products} />
          </div>
        </section>
      )}

      {/* 4. Dehydration Process Timeline (Powders Only) */}
      {isDehydrated && ("""

content = re.sub(old_section_3, new_section_3, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated src/routes/products.$category.index.tsx successfully!')
