import os, re, json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Products to delete
DELETED_SLUGS = {
    'dehydrated-white-onion-flakes',
    'dehydrated-red-onion-flakes',
    'dehydrated-garlic-flakes',
    'garlic-granules',
    'dehydrated-ginger-flakes',
    'potato-flakes',
}

# The 22 target powders in order:
TARGET_22_ORDER = [
    'white-onion-powder',
    'pink-red-onion-powder',
    'garlic-powder',
    'ginger-powder-saunth',
    'moringa-leaf-powder',
    'moringa-seed-powder',
    'spinach-powder',
    'curry-leaf-powder',
    'mint-leaf-powder',
    'coriander-leaf-powder',
    'kasuri-methi-powder',
    'tomato-powder',
    'beetroot-powder',
    'carrot-powder',
    'green-chilli-powder',
    'pumpkin-powder',
    'mango-powder-amchur',
    'banana-powder',
    'lemon-powder',
    'amla-powder',
    'aloe-vera-powder',
    'hibiscus-powder',
]

print("Script initialized.")
