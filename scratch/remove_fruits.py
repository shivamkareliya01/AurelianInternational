import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Products to remove
slugs_to_remove = [
    'thompson-seedless-grapes',
    'nagpur-orange',
    'lemon',
    'papaya',
    'pineapple'
]

# Let's locate the boundary of fresh-fruits category
fruits_marker = '"slug": "fresh-fruits"'
spices_marker = '"slug": "spices"'

f_idx = content.find(fruits_marker)
s_idx = content.find(spices_marker)

print("fruits_marker:", f_idx, "spices_marker:", s_idx)

# In between f_idx and s_idx, let's find bhagwa-pomegranate
bp_marker = '"slug": "bhagwa-pomegranate"'
bp_idx = content.find(bp_marker)

# After bhagwa-pomegranate product ends, there is:
#       }
#     ]
#   },
#   {
#     "slug": "spices"

# Let's find the closing of bhagwa-pomegranate product:
bp_end = content.find('"alt": "Whole ripe ruby-red Bhagwa pomegranate and juicy cut arils"\n      }')
if bp_end == -1:
    bp_end = content.find('"alt": "Whole ripe ruby-red Bhagwa pomegranate and juicy cut arils"\r\n      }')

print("bp_end:", bp_end)

# And find where the spices category starts
spices_cat_start = content.rfind('  {\n    "slug": "spices"', 0, s_idx)
if spices_cat_start == -1:
    spices_cat_start = content.rfind('  {\r\n    "slug": "spices"', 0, s_idx)

print("spices_cat_start:", spices_cat_start)

# The new content should connect bp product closing to closing of fresh-fruits category:
#       }
#     ]
#   },
#   {
#     "slug": "spices",

new_content = (
    content[:bp_end + len('"alt": "Whole ripe ruby-red Bhagwa pomegranate and juicy cut arils"\n      }')]
    + '\n    ]\n  },\n'
    + content[spices_cat_start:]
)

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully removed the 5 fruit products!")
