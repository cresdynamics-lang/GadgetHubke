# Accessories owner checklist

Replace every placeholder below before launch. Specs and fit rules are flagged **check final specs** on the site until you confirm.

## Prices and stock
- [ ] Replace all sample KES prices in `src/lib/accessories/config.ts` (`accessoryBasePricesKes`) with live admin/stock prices
- [ ] Confirm stock status wording (currently “In stock (sample) · Collect today in Nairobi”)
- [ ] Engraving for Pencil Pro: offered? Fee? (config `engravingNote`, sample add +0)

## Contact and shop
- [ ] WhatsApp number (`accessoriesConfig.whatsapp`)
- [ ] Shop address and hours (`accessoriesConfig.address`)
- [ ] Lipa Mdogo Mdogo deposit/months and real interest terms (`accessoriesConfig.lipa`)
- [ ] Set-up / pairing service fee and warranty wording (buying notes + FAQ)

## Specs and compatibility (critical)
- [ ] Re-verify every Pencil and Magic Keyboard figure on apple.com/apple-pencil and apple.com/ipad-keyboards
- [ ] Re-verify every `pencilFits` / `keyboardFits` rule against Apple’s compatibility lists
- [ ] Confirm MQ052 Magic Keyboard with Numeric Keypad generation
- [ ] Confirm keyboard layout on stock (photos are US English)
- [ ] Confirm Pencil Pro / USB-C / 2nd gen / 1st gen feature gaps (pressure, squeeze, hover, adapter)

## Images and models without photos
- [ ] Apple Pencil (1st gen): overview image only - line “Image shows the product design.”
- [ ] Older iPad Magic Keyboards (2020 - 2022), Smart Keyboard Folio, original Touch ID for Intel Macs: no photos here - text-only if stocked
- [ ] Permission to use Apple product photos on the live site (footer trademark line)

## Live groups (verify content)
- [ ] Magic Mouse and Magic Trackpad pages + pointer fits
- [ ] Power adapters, MagSafe, cables
- [ ] iPhone cases, Smart Folio, straps

## Cross-links
- [ ] iPad PDP add-on checkboxes use shared `pencilFits` / `keyboardFits` (wired in `src/lib/ipad/accessories.ts`)
- [ ] Mac PDP keyboard add-ons (if added) should use the same fits module

## Manifest
- Pencil pack: **74** files  
- Keyboard pack: **79** files  
- Regenerated via `npm run accessories:manifest` (fails if counts change)
