/**
 * Journal posts written for the searches Nairobi buyers type that no product page
 * answers on its own: where to buy, which one is best, old iPhones, Ex-UK, fakes,
 * gifts. Titles are deliberately long so they carry every common phrasing.
 * Prices are live placeholders ({{price:id[:option]}} / {{exuk:id[:option]}}).
 */
import type { JournalPost } from "./journal";

const base = {
  author: "GadgetHub",
  status: "published" as const,
  date: "2026-10-25",
  dateLabel: "25 Oct 2026",
  views: 0,
  category: "Buying guides",
};

export const journalSearchGuidePosts: JournalPost[] = [
  {
    ...base,
    id: "j-best-place-buy-iphone-nairobi",
    slug: "best-place-to-buy-iphone-in-nairobi",
    title:
      "Best Place to Buy an Original iPhone in Nairobi 2026: Trusted Apple Authorised Reseller in Nairobi CBD, Prices, Warranty and How to Avoid Fakes",
    seoTitle:
      "Best Place to Buy iPhone in Nairobi 2026 | Original iPhone Shop in Nairobi CBD | Apple Authorised Reseller | New & Ex-UK | Gadget Hub",
    excerpt:
      "Where to buy a genuine iPhone in Nairobi without the risk: what a trustworthy iPhone shop looks like, live prices from {{exuk:iphone-11}}, warranty, M-Pesa checkout and Lipa Mdogo Mdogo.",
    seoDescription:
      "Looking for the best iPhone shop in Nairobi? Gadget Hub is an Apple Authorised Reseller at Norwich Union House, Nairobi CBD. Original iPhones new or Ex-UK, 1-year warranty on new, M-Pesa and Lipa Mdogo Mdogo.",
    tags: ["best place to buy iPhone in Nairobi", "iPhone shop Nairobi", "original iPhone Kenya", "Apple shop Nairobi CBD", "where to buy iPhone in Kenya"],
    coverAlt: "Gadget Hub iPhone shop, Nairobi CBD",
    paragraphs: [
      "“Best place to buy iPhone in Nairobi”, “original iPhone shop Nairobi CBD”, “where to buy a genuine iPhone in Kenya” — people search this because the risk is real. A phone that looks perfect on Instagram can turn out to be refurbished, locked to a foreign network, or a copy. This guide explains what a trustworthy iPhone shop in Nairobi looks like, then shows exactly what you get at Gadget Hub.",
      "## What makes a good iPhone shop in Nairobi",
      "A shop worth your money does five things. It has a physical address you can walk into. It tells you plainly whether a phone is sealed new or used. It gives you a proper invoice with the serial number on it. It lets you pay to a business, not a personal M-Pesa number. And it answers when something goes wrong after you have paid. If a seller fails any one of these, the low price is not a deal.",
      "## Why Nairobi buyers choose Gadget Hub",
      "Gadget Hub is an Apple Authorised Reseller at Norwich Union House, Suite 15, 4th Floor, in Nairobi CBD (Mon–Sat 8am–8pm, Sun 10am–8pm). Every iPhone is genuine Apple stock, sold either sealed new with a 1-year warranty or Ex-UK (UK-used) with the condition stated on your invoice. You pay on [checkout](/checkout) by M-Pesa — the prompt comes from the business, so there is no screenshot of a till number and no “send to my line”. Collect in town or take Nairobi delivery.",
      "## iPhone prices at Gadget Hub today",
      "Prices on this page are live from our shop. The newest phones: [iPhone 18 Pro Max](/iphone/iphone-18-pro-max) from {{price:iphone-18-pro-max}}, [iPhone 18 Pro](/iphone/iphone-18-pro) from {{price:iphone-18-pro}}, [iPhone 17 Pro Max](/iphone/iphone-17-pro-max) from {{price:iphone-17-pro-max}} and [iPhone 17](/iphone/iphone-17) from {{price:iphone-17}}. Value picks: [iPhone 16](/iphone/iphone-16) from {{price:iphone-16}}, [iPhone 16e](/iphone/iphone-16e) from {{price:iphone-16e}}. Budget Ex-UK: [iPhone 13](/iphone/iphone-13) from {{exuk:iphone-13}}, [iPhone 12](/iphone/iphone-12) from {{exuk:iphone-12}} and [iPhone 11](/iphone/iphone-11) from {{exuk:iphone-11}}. The full list is on the [iPhone price page](/iphone).",
      "## How to check any iPhone before you pay",
      "Wherever you buy, check three things. Dial *#06# and make sure the IMEI on screen matches the box and the invoice. Open Settings › General › About and check the model and serial. Then put in your own Safaricom or Airtel SIM and make a call. Our guide to [spotting an original iPhone in Kenya](/journal/how-to-tell-original-iphone-kenya) walks through it step by step.",
      "## Paying in instalments or trading in",
      "If paying in full is hard this month, [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo) is run in-house: a deposit today and the balance monthly, with no third-party app. If you have an older iPhone or a Samsung, [trade it in](/trade-in) and pay only the difference. Not sure what fits your budget? Read [the best iPhone to buy in Kenya by budget](/journal/best-iphone-to-buy-in-kenya).",
    ],
    faq: [
      { q: "Where is the best place to buy an original iPhone in Nairobi?", a: "Buy from a shop with a physical address, a proper invoice with the serial number, and business payment. Gadget Hub is an Apple Authorised Reseller at Norwich Union House, Suite 15, 4th Floor, Nairobi CBD." },
      { q: "Does Gadget Hub sell original iPhones?", a: "Yes. Every iPhone is genuine Apple stock, sold sealed new with a 1-year warranty or Ex-UK (UK-used) with the condition stated on your invoice." },
      { q: "What is the cheapest iPhone at Gadget Hub?", a: "Ex-UK iPhone 11 from {{exuk:iphone-11}}. The cheapest sealed new current iPhone is the iPhone 16e from {{price:iphone-16e}}." },
      { q: "Can I pay for an iPhone with M-Pesa?", a: "Yes. Pay on the website checkout with an M-Pesa prompt to your phone, or pay in the shop." },
      { q: "Do you deliver iPhones in Nairobi?", a: "Yes. Nairobi delivery is arranged after payment, or collect at Norwich Union House in the CBD." },
      { q: "Can I buy an iPhone in instalments in Nairobi?", a: "Yes, with [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo): pay a deposit, then the balance monthly." },
    ],
  },
  {
    ...base,
    id: "j-old-iphone-prices-kenya",
    slug: "iphone-7-8-x-xr-xs-se-price-in-kenya",
    title:
      "iPhone 7, iPhone 8, iPhone X, XR, XS and iPhone SE Price in Kenya 2026: What Old iPhones Are Worth, Trade-In Value and the Cheapest Upgrade in Nairobi",
    seoTitle:
      "iPhone 7 Price in Kenya 2026 | iPhone 8, iPhone X, XR, XS, XS Max & SE Prices, Trade-In Value and Cheapest Upgrade in Nairobi | Gadget Hub",
    excerpt:
      "Searching for an iPhone 7, 8, X, XR or SE in Kenya? What these phones can still do in 2026, what they are worth on trade-in, and the cheapest upgrade from {{exuk:iphone-11}}.",
    seoDescription:
      "iPhone 7, iPhone 8, iPhone X, XR, XS and SE in Kenya: are they still worth buying in 2026? Trade-in value at Gadget Hub Nairobi and the cheapest upgrade, iPhone 11 Ex-UK from {{exuk:iphone-11}}.",
    tags: ["iPhone 7 price in Kenya", "iPhone 8 price in Kenya", "iPhone X price in Kenya", "iPhone XR price in Kenya", "iPhone XS price in Kenya", "iPhone SE price in Kenya"],
    coverAlt: "Older iPhone models",
    paragraphs: [
      "“iPhone 7 price in Kenya”, “iPhone 8 Plus price Nairobi”, “iPhone XR price in Kenya”, “iPhone X price in Kenya 2026” — these are still searched every day, usually by someone who wants an iPhone for the least money possible, or who has one of these phones and wants to know what it is worth. Here is the honest picture.",
      "## Should you buy an iPhone 7, 8, X, XR or XS in 2026?",
      "These phones are now old. The iPhone 7 and 8 no longer get the newest iOS versions, which means some banking and messaging apps will stop supporting them over time, and batteries on most units in Kenya are well past their best. The X, XS and XR are better but are on borrowed time for updates too. For most people, spending money on one of these phones today means buying again within a year.",
      "That is why Gadget Hub does not sell iPhone 7, 8, X, XS or XR. We start at the iPhone 11, which still runs current apps comfortably, and we sell it Ex-UK at prices close to what people ask for much older phones.",
      "## The cheapest upgrade: iPhone 11, 12 and 13 Ex-UK",
      "[iPhone 11](/iphone/iphone-11) Ex-UK starts at {{exuk:iphone-11:64}} for 64GB and {{exuk:iphone-11:128}} for 128GB. [iPhone 12](/iphone/iphone-12) Ex-UK starts at {{exuk:iphone-12:64}}, and [iPhone 13](/iphone/iphone-13) Ex-UK at {{exuk:iphone-13:128}}. Compared with an iPhone 8 or XR, you get a much better camera, Face ID, a battery that lasts the day, and years more app support. Our [cheapest iPhone in Kenya guide](/journal/cheapest-iphone-in-kenya) lists every budget option.",
      "## iPhone SE in Kenya",
      "People searching “iPhone SE price in Kenya” usually want a small, cheap iPhone with a home button. The SE is no longer the cheapest way into a modern iPhone: the [iPhone 12 mini](/iphone/iphone-12-mini) Ex-UK from {{exuk:iphone-12-mini}} and [iPhone 13 mini](/iphone/iphone-13-mini) Ex-UK from {{exuk:iphone-13-mini}} are small, have Face ID and better cameras. If you want the newest budget iPhone instead, the [iPhone 16e](/iphone/iphone-16e) starts at {{price:iphone-16e}} sealed new.",
      "## What is my old iPhone worth?",
      "If you already own an iPhone 7, 8, X, XR or XS, it still has trade-in value. Bring it to Norwich Union House or start online on [trade-in](/trade-in): we inspect the phone (screen, battery, Face ID or Touch ID, iCloud signed out) and give you a quote you can put straight toward a newer iPhone. No money changes hands until you agree. Before you come, back up your photos and sign out of iCloud.",
    ],
    faq: [
      { q: "What is the iPhone 7 price in Kenya in 2026?", a: "Gadget Hub does not sell the iPhone 7 because it no longer gets current iOS updates. The cheapest iPhone we sell is the iPhone 11 Ex-UK from {{exuk:iphone-11}}." },
      { q: "Is the iPhone XR still worth buying in Kenya?", a: "For most people, no. An Ex-UK iPhone 11 from {{exuk:iphone-11}} costs a little more, has a better camera and battery, and gets app support for longer." },
      { q: "Can I trade in my iPhone 7 or iPhone 8?", a: "Yes. Start on the [trade-in page](/trade-in) or bring it to Norwich Union House. We inspect it and quote a value you can put toward a newer iPhone." },
      { q: "What is the cheapest small iPhone in Kenya?", a: "The iPhone 12 mini Ex-UK from {{exuk:iphone-12-mini}} and iPhone 13 mini Ex-UK from {{exuk:iphone-13-mini}}." },
      { q: "Do you sell the iPhone SE?", a: "Not currently. For a small iPhone, see the 12 mini or 13 mini; for the newest budget iPhone, the iPhone 16e from {{price:iphone-16e}}." },
    ],
  },
  {
    ...base,
    id: "j-best-iphone-kenya",
    slug: "best-iphone-to-buy-in-kenya",
    title:
      "Best iPhone to Buy in Kenya 2026 by Budget: Best iPhone Under 50k, Under 100k, Under 150k and the Best iPhone Overall in Nairobi",
    seoTitle:
      "Best iPhone to Buy in Kenya 2026 | Best iPhone Under 50k, 100k & 150k | Best Camera, Battery & Value iPhone in Nairobi | Gadget Hub",
    excerpt:
      "Which iPhone should you buy in Kenya? Our picks by budget — from Ex-UK iPhone 13 at {{exuk:iphone-13}} to iPhone 18 Pro Max at {{price:iphone-18-pro-max}} — plus the best for camera, battery and value.",
    seoDescription:
      "Best iPhone to buy in Kenya in 2026, by budget: under 50k, under 100k, under 150k and overall. Best camera, best battery and best value iPhone with live Nairobi prices at Gadget Hub.",
    tags: ["best iPhone to buy in Kenya", "best iPhone under 50k Kenya", "best iPhone under 100k", "best iPhone for camera", "best iPhone for battery"],
    coverAlt: "iPhone lineup in Kenya",
    paragraphs: [
      "“Which iPhone should I buy?” is the question we answer most on WhatsApp, usually followed by a budget. So this guide is organised the way Nairobi buyers think: by how much you want to spend, then by what matters most to you. Every price is live from our shop.",
      "## Best iPhone under KES 50,000",
      "Go Ex-UK. The [iPhone 13](/iphone/iphone-13) Ex-UK at {{exuk:iphone-13:128}} is the pick: a strong camera, all-day battery and plenty of years of updates left. On a tighter budget, the [iPhone 12](/iphone/iphone-12) Ex-UK from {{exuk:iphone-12}} or [iPhone 11](/iphone/iphone-11) Ex-UK from {{exuk:iphone-11}} still do everything most people need: WhatsApp, M-Pesa, banking apps, social media and good photos.",
      "## Best iPhone under KES 100,000",
      "The [iPhone 16e](/iphone/iphone-16e) at {{price:iphone-16e:128}} sealed new is the smart buy: a current chip, USB-C and the longest update runway at this price. If you prefer more camera for the money, the [iPhone 15](/iphone/iphone-15) from {{price:iphone-15}} new, or an Ex-UK [iPhone 15 Pro](/iphone/iphone-15-pro) from {{exuk:iphone-15-pro}}, are excellent. The standard [iPhone 16](/iphone/iphone-16) starts at {{price:iphone-16}}.",
      "## Best iPhone under KES 150,000",
      "The [iPhone 17](/iphone/iphone-17) at {{price:iphone-17:256}} for 256GB is the best all-rounder Apple makes: it starts at 256GB, so storage is never a worry. If you want a thin, light phone, the [iPhone Air](/iphone/iphone-air) starts at {{price:iphone-air}}. If you want Pro cameras for less, an Ex-UK [iPhone 17 Pro](/iphone/iphone-17-pro) starts at {{exuk:iphone-17-pro}}.",
      "## Best iPhone overall",
      "The [iPhone 18 Pro Max](/iphone/iphone-18-pro-max) from {{price:iphone-18-pro-max}} is the best iPhone you can buy: the biggest screen, the longest battery life and the best cameras. The [iPhone 18 Pro](/iphone/iphone-18-pro) from {{price:iphone-18-pro}} is the same phone in a smaller size. Last year's [iPhone 17 Pro Max](/iphone/iphone-17-pro-max) from {{price:iphone-17-pro-max}} is nearly as good for less.",
      "## Best iPhone for camera, battery and value",
      "Best camera: iPhone 18 Pro or Pro Max. Best battery: any Pro Max — the 18 Pro Max, 17 Pro Max or an Ex-UK 16 Pro Max from {{exuk:iphone-16-pro-max}}. Best value: iPhone 16e new, or iPhone 13 Ex-UK. Best for students: iPhone 16e or iPhone 13 Ex-UK, paired with [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo) if needed.",
      "## Before you buy",
      "Choose at least 128GB, and 256GB if you shoot a lot of video or keep WhatsApp media. Decide new or Ex-UK — our [new vs Ex-UK guide](/journal/new-and-ex-uk-apple-devices) explains the difference. Then buy on the product page with M-Pesa and collect at Norwich Union House, Nairobi CBD, or [trade in](/trade-in) your old phone to bring the price down.",
    ],
    faq: [
      { q: "What is the best iPhone to buy in Kenya in 2026?", a: "Overall, the iPhone 18 Pro Max from {{price:iphone-18-pro-max}}. For value, the iPhone 16e from {{price:iphone-16e}} new or the iPhone 13 Ex-UK from {{exuk:iphone-13}}." },
      { q: "What is the best iPhone under 50,000 shillings?", a: "The iPhone 13 Ex-UK at {{exuk:iphone-13:128}} (128GB). Cheaper options are the iPhone 12 Ex-UK from {{exuk:iphone-12}} and iPhone 11 Ex-UK from {{exuk:iphone-11}}." },
      { q: "What is the best iPhone under 100,000 shillings?", a: "The iPhone 16e at {{price:iphone-16e:128}} sealed new, or an Ex-UK iPhone 15 Pro from {{exuk:iphone-15-pro}}." },
      { q: "Which iPhone has the best battery?", a: "The Pro Max models: iPhone 18 Pro Max, 17 Pro Max and 16 Pro Max." },
      { q: "Which iPhone is best for students in Kenya?", a: "The iPhone 16e new or the iPhone 13 Ex-UK, both of which you can spread out with Lipa Mdogo Mdogo." },
    ],
  },
  {
    ...base,
    id: "j-iphone-17-price-kenya",
    slug: "iphone-17-price-in-kenya",
    title:
      "iPhone 17 Price in Kenya 2026: iPhone 17, iPhone 17e and iPhone Air Prices in Nairobi, 256GB, 512GB and 1TB, New and Ex-UK",
    seoTitle:
      "iPhone 17 Price in Kenya 2026 | iPhone 17, iPhone 17e & iPhone Air Prices in Nairobi | 256GB, 512GB | New & Ex-UK | Gadget Hub",
    excerpt:
      "iPhone 17 from {{price:iphone-17}}, iPhone 17e from {{price:iphone-17e}} and iPhone Air from {{price:iphone-air}} in Nairobi — every storage size, new and Ex-UK, and which to choose.",
    seoDescription:
      "iPhone 17 price in Kenya from {{price:iphone-17}}; iPhone 17e from {{price:iphone-17e}}; iPhone Air from {{price:iphone-air}}. New and Ex-UK prices in Nairobi, M-Pesa or Lipa Mdogo Mdogo at Gadget Hub.",
    tags: ["iPhone 17 price in Kenya", "iPhone 17e price in Kenya", "iPhone Air price in Kenya", "iPhone 17 256GB price", "iPhone 17 Nairobi"],
    coverAlt: "iPhone 17, iPhone 17e and iPhone Air",
    paragraphs: [
      "“iPhone 17 price in Kenya”, “iPhone 17 256GB price Nairobi”, “iPhone Air price in Kenya” and “iPhone 17e price” are the searches for people who want a new iPhone without paying Pro money. Here are the prices from our shop, which update live.",
      "## iPhone 17 price in Kenya",
      "[iPhone 17](/iphone/iphone-17): {{price:iphone-17:256}} for 256GB and {{price:iphone-17:512}} for 512GB, sealed new. Ex-UK from {{exuk:iphone-17:256}}. There is no 128GB iPhone 17 — it starts at 256GB, which is the storage most people end up wishing they had bought anyway.",
      "## iPhone 17e price in Kenya",
      "[iPhone 17e](/iphone/iphone-17e): {{price:iphone-17e:256}} for 256GB and {{price:iphone-17e:512}} for 512GB new; Ex-UK from {{exuk:iphone-17e:256}}. The 17e is the value model of the 17 family — the right choice if you want a current iPhone and do not need the extra camera of the standard 17.",
      "## iPhone Air price in Kenya",
      "[iPhone Air](/iphone/iphone-air): {{price:iphone-air:256}} for 256GB, {{price:iphone-air:512}} for 512GB and {{price:iphone-air:1tb}} for 1TB; Ex-UK from {{exuk:iphone-air:256}}. The Air is Apple's thinnest, lightest iPhone, for people who want a big screen that does not weigh down a pocket.",
      "## iPhone 17, 17e or Air?",
      "Pick the 17 if you want the best balance of camera, battery and price. Pick the 17e if price matters most. Pick the Air if you want the thinnest phone and a large display. If you want Pro cameras, look at the [iPhone 17 Pro and Pro Max](/journal/iphone-17-pro-and-pro-max-price-in-kenya). Comparing with last year? Read [iPhone 17 vs iPhone 16 in Kenya](/journal/iphone-17-vs-iphone-16-kenya).",
      "## How to buy in Nairobi",
      "Choose storage and colour on the product page and pay by M-Pesa at checkout. Collect at Norwich Union House, Suite 15, 4th Floor, Nairobi CBD, or take delivery. [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo) spreads the cost, and [trade-in](/trade-in) takes your old phone off the price.",
    ],
    faq: [
      { q: "What is the iPhone 17 price in Kenya?", a: "From {{price:iphone-17:256}} for 256GB and {{price:iphone-17:512}} for 512GB, sealed new. Ex-UK from {{exuk:iphone-17:256}}." },
      { q: "Is there a 128GB iPhone 17?", a: "No. The iPhone 17 starts at 256GB." },
      { q: "What is the iPhone Air price in Kenya?", a: "From {{price:iphone-air:256}} for 256GB, up to {{price:iphone-air:1tb}} for 1TB." },
      { q: "What is the iPhone 17e price in Kenya?", a: "From {{price:iphone-17e:256}} for 256GB, sealed new." },
      { q: "Can I buy the iPhone 17 on instalments?", a: "Yes, with Lipa Mdogo Mdogo: a deposit today and the balance monthly." },
    ],
  },
  {
    ...base,
    id: "j-ex-uk-iphone-prices-kenya",
    slug: "ex-uk-iphone-prices-in-kenya",
    title:
      "Ex-UK iPhone Prices in Kenya 2026: Full Price List for Ex-UK iPhone 11, 12, 13, 14, 15, 16 and 17 Pro Max in Nairobi",
    seoTitle:
      "Ex-UK iPhone Prices in Kenya 2026 | Ex-UK iPhone 11, 12, 13, 14, 15, 16, 17 Pro Max Price List Nairobi | Used iPhones | Gadget Hub",
    excerpt:
      "Every Ex-UK iPhone price at Gadget Hub Nairobi in one list — from iPhone 11 at {{exuk:iphone-11}} to iPhone 17 Pro Max at {{exuk:iphone-17-pro-max}} — and what Ex-UK actually means.",
    seoDescription:
      "Ex-UK iPhone prices in Kenya: iPhone 11 from {{exuk:iphone-11}}, iPhone 13 from {{exuk:iphone-13}}, iPhone 15 Pro Max from {{exuk:iphone-15-pro-max}}, iPhone 16 Pro Max from {{exuk:iphone-16-pro-max}}. Genuine UK-used iPhones at Gadget Hub Nairobi.",
    tags: ["Ex-UK iPhone prices in Kenya", "Ex-UK iPhone Nairobi", "used iPhone Kenya", "Ex-UK iPhone 13 price", "Ex-UK iPhone 15 Pro Max price"],
    coverAlt: "Ex-UK iPhones",
    paragraphs: [
      "“Ex-UK iPhone prices in Kenya” is one of the biggest phone searches in Nairobi, because Ex-UK is how most people get a Pro iPhone for far less than new. This is the full list from our shop, with live prices, plus what you should know before buying Ex-UK anywhere.",
      "## What Ex-UK means",
      "Ex-UK iPhones are genuine Apple phones that were first used in the United Kingdom and then brought to Kenya. They are not copies or Kenyan refurbishments. At Gadget Hub every Ex-UK unit is checked and its condition and warranty terms are written on your invoice. Read more in [new vs Ex-UK](/journal/new-and-ex-uk-apple-devices).",
      "## Ex-UK iPhone 11 to 13 prices",
      "[iPhone 11](/iphone/iphone-11) from {{exuk:iphone-11}} · [iPhone 11 Pro](/iphone/iphone-11-pro) from {{exuk:iphone-11-pro}} · [iPhone 11 Pro Max](/iphone/iphone-11-pro-max) from {{exuk:iphone-11-pro-max}} · [iPhone 12](/iphone/iphone-12) from {{exuk:iphone-12}} · [iPhone 12 Pro](/iphone/iphone-12-pro) from {{exuk:iphone-12-pro}} · [iPhone 12 Pro Max](/iphone/iphone-12-pro-max) from {{exuk:iphone-12-pro-max}} · [iPhone 13](/iphone/iphone-13) from {{exuk:iphone-13}} · [iPhone 13 Pro](/iphone/iphone-13-pro) from {{exuk:iphone-13-pro}} · [iPhone 13 Pro Max](/iphone/iphone-13-pro-max) from {{exuk:iphone-13-pro-max}}.",
      "## Ex-UK iPhone 14 and 15 prices",
      "[iPhone 14](/iphone/iphone-14) from {{exuk:iphone-14}} · [iPhone 14 Pro](/iphone/iphone-14-pro) from {{exuk:iphone-14-pro}} · [iPhone 14 Pro Max](/iphone/iphone-14-pro-max) from {{exuk:iphone-14-pro-max}} · [iPhone 15](/iphone/iphone-15) from {{exuk:iphone-15}} · [iPhone 15 Pro](/iphone/iphone-15-pro) from {{exuk:iphone-15-pro}} · [iPhone 15 Pro Max](/iphone/iphone-15-pro-max) from {{exuk:iphone-15-pro-max}}.",
      "## Ex-UK iPhone 16 and 17 prices",
      "[iPhone 16](/iphone/iphone-16) from {{exuk:iphone-16}} · [iPhone 16 Pro](/iphone/iphone-16-pro) from {{exuk:iphone-16-pro}} · [iPhone 16 Pro Max](/iphone/iphone-16-pro-max) from {{exuk:iphone-16-pro-max}} · [iPhone 17](/iphone/iphone-17) from {{exuk:iphone-17}} · [iPhone 17 Pro](/iphone/iphone-17-pro) from {{exuk:iphone-17-pro}} · [iPhone 17 Pro Max](/iphone/iphone-17-pro-max) from {{exuk:iphone-17-pro-max}}.",
      "## How to buy Ex-UK safely",
      "On any iPhone page, switch the price toggle to Ex-UK to see every storage size. Check the IMEI (*#06#) matches the invoice, test Face ID, the cameras and your own SIM, and make sure iCloud is signed out before you leave. Our guide on [spotting an original iPhone](/journal/how-to-tell-original-iphone-kenya) covers the checks. Pay by M-Pesa on checkout, and spread the cost with [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo) if you need to.",
    ],
    faq: [
      { q: "What is the cheapest Ex-UK iPhone in Kenya?", a: "At Gadget Hub, the Ex-UK iPhone 11 from {{exuk:iphone-11}}." },
      { q: "How much is an Ex-UK iPhone 13 in Kenya?", a: "From {{exuk:iphone-13}} at Gadget Hub; the 13 Pro Max Ex-UK starts at {{exuk:iphone-13-pro-max}}." },
      { q: "How much is an Ex-UK iPhone 15 Pro Max in Kenya?", a: "From {{exuk:iphone-15-pro-max}} at Gadget Hub." },
      { q: "Are Ex-UK iPhones original?", a: "Yes. Ex-UK iPhones are genuine Apple phones first used in the UK. Gadget Hub states the condition and warranty terms on your invoice." },
      { q: "Do Ex-UK iPhones work on Safaricom and Airtel?", a: "Yes. They are unlocked and work with Kenyan SIM cards; test your own SIM before you leave the shop." },
    ],
  },
  {
    ...base,
    id: "j-original-iphone-check-kenya",
    slug: "how-to-tell-original-iphone-kenya",
    title:
      "How to Tell an Original iPhone from a Fake or Refurbished One in Kenya: IMEI, Serial Number, iCloud and Battery Checks Before You Buy in Nairobi",
    seoTitle:
      "How to Know an Original iPhone in Kenya | Check Fake vs Original iPhone, IMEI, Serial Number & iCloud Before Buying in Nairobi | Gadget Hub",
    excerpt:
      "Six checks that take five minutes and protect your money: IMEI, serial number, iCloud, battery health, Face ID and SIM — plus the warning signs of a fake iPhone deal in Nairobi.",
    seoDescription:
      "How to tell if an iPhone is original in Kenya: check the IMEI with *#06#, the serial number on Apple's coverage site, iCloud, battery health and Face ID. Avoid fake iPhones in Nairobi.",
    tags: ["how to know original iPhone Kenya", "fake iPhone Kenya", "check iPhone IMEI Kenya", "original vs refurbished iPhone", "iPhone scam Nairobi"],
    coverAlt: "Checking an iPhone's IMEI",
    paragraphs: [
      "“How to know an original iPhone”, “fake iPhone Kenya”, “check iPhone IMEI Kenya” — if you are buying a phone outside an established shop, these five minutes of checks are the best protection you have. They work on any iPhone, wherever you buy it.",
      "## 1. Check the IMEI",
      "Dial *#06#. The IMEI on screen must match the number on the box, on the back of the SIM tray area or in Settings › General › About, and on your invoice. If they do not match, walk away.",
      "## 2. Check the serial number with Apple",
      "In Settings › General › About, note the serial number and enter it on Apple's “Check Coverage” website. It should show the exact model you are being sold. A serial that is not recognised, or shows a different model, means the phone is not what it claims to be.",
      "## 3. Make sure iCloud is signed out",
      "Go to Settings and tap the name at the top. If someone else's Apple ID is signed in, the phone can be locked remotely. The seller must sign out in front of you, and Find My must be off. Never accept “I will remove it later”.",
      "## 4. Look at battery health and parts",
      "Settings › Battery › Battery Health shows the battery's capacity. Under Settings › General › About, newer iPhones list “Parts and Service History” — a message about an unknown part means the screen, battery or camera was replaced with a non-Apple part.",
      "## 5. Test Face ID, cameras and your own SIM",
      "Set up Face ID, take a photo with every camera, record a short video and play it back. Insert your own Safaricom or Airtel SIM and make a call and use mobile data. A network lock or a dead camera shows up here.",
      "## 6. Pay a business, get an invoice",
      "Warning signs of a fake deal: a price far below every shop, pressure to pay a personal M-Pesa number, no physical address, and no invoice with the serial number. At Gadget Hub, an Apple Authorised Reseller at Norwich Union House in Nairobi CBD, you pay through the business checkout, get an invoice with the serial number, and can do every check above at the counter. See our [iPhone prices](/iphone) or read [where to buy an iPhone in Nairobi](/journal/best-place-to-buy-iphone-in-nairobi).",
    ],
    faq: [
      { q: "How do I check if an iPhone is original in Kenya?", a: "Dial *#06# and match the IMEI to the box and invoice, check the serial number on Apple's Check Coverage site, and confirm iCloud is signed out." },
      { q: "How do I check an iPhone's IMEI?", a: "Dial *#06#, or open Settings › General › About. The number must match the box and your invoice." },
      { q: "What is the difference between Ex-UK and refurbished?", a: "Ex-UK phones are genuine iPhones first used in the UK. Refurbished can mean anything from Apple-certified to local repairs with non-Apple parts — check Parts and Service History in Settings." },
      { q: "Can a locked iCloud iPhone be unlocked?", a: "Only by the original owner signing out. Never buy an iPhone with someone else's Apple ID still signed in." },
      { q: "Where can I buy a guaranteed original iPhone in Nairobi?", a: "From an Apple Authorised Reseller such as Gadget Hub at Norwich Union House, Nairobi CBD, with an invoice showing the serial number." },
    ],
  },
  {
    ...base,
    id: "j-best-macbook-kenya",
    slug: "best-macbook-to-buy-in-kenya",
    title:
      "Best MacBook to Buy in Kenya 2026: Best MacBook for Students, Office Work, Coding and Video Editing, with MacBook Air and MacBook Pro Prices in Nairobi",
    seoTitle:
      "Best MacBook in Kenya 2026 | Best MacBook for Students, Coding & Video Editing | MacBook Air vs MacBook Pro Prices Nairobi | Gadget Hub",
    excerpt:
      "Which MacBook to buy in Kenya: our picks for students, office work, coding and video editing — from Ex-UK MacBook Air M1 at {{exuk:macbook-air-13-m1}} to MacBook Pro M5 Pro.",
    seoDescription:
      "Best MacBook in Kenya 2026: MacBook Air M4 and M5 for students and office work, MacBook Pro for coding and video editing. Live MacBook prices in Nairobi, new and Ex-UK, at Gadget Hub.",
    tags: ["best MacBook in Kenya", "best MacBook for students Kenya", "best laptop for university Kenya", "MacBook for video editing", "best MacBook for coding"],
    coverAlt: "MacBook Air and MacBook Pro",
    paragraphs: [
      "“Best MacBook in the market”, “best MacBook in Kenya”, “best laptop for university Kenya” — the right answer depends on what you will do with it. Here is how we advise customers at the counter, with live prices.",
      "## Best MacBook for most people: MacBook Air 13-inch",
      "The [MacBook Air 13-inch M4](/mac/macbook-air-13-m4) from {{price:macbook-air-13-m4}} is the MacBook we recommend most. It is silent (no fan), light enough to carry all day, lasts through a full day of classes or work on one charge, and has 16GB of memory as standard — enough for years. The newer [MacBook Air 13-inch M5](/mac/macbook-air-13-m5) starts at {{price:macbook-air-13-m5}}.",
      "## Best MacBook for students on a budget",
      "If the budget is tight, an Ex-UK [MacBook Air M1](/mac/macbook-air-13-m1) from {{exuk:macbook-air-13-m1}} still handles assignments, research, Zoom and Office comfortably. A step up, the [MacBook Air M2](/mac/macbook-air-13-m2) is from {{exuk:macbook-air-13-m2}} Ex-UK. Students can spread the cost with [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo).",
      "## Best MacBook for a bigger screen",
      "If you work with spreadsheets, design or long documents, the [MacBook Air 15-inch M4](/mac/macbook-air-15-m4) from {{price:macbook-air-15-m4}} gives you a much larger display without much extra weight.",
      "## Best MacBook for coding and video editing",
      "For video editing, music production, large code projects or 3D work, choose a MacBook Pro — it has a fan for sustained performance, a brighter display and more ports. The [MacBook Pro 14-inch M4](/mac/macbook-pro-14-m4) starts at {{price:macbook-pro-14-m4}} and the [MacBook Pro 14-inch M5](/mac/macbook-pro-14-m5) at {{price:macbook-pro-14-m5}}. For professional 4K and 8K editing, the [MacBook Pro 14-inch M5 Pro](/mac/macbook-pro-14-m5-pro) starts at {{price:macbook-pro-14-m5-pro}}.",
      "## How much memory and storage?",
      "16GB of memory is the right minimum today; 24GB or more for heavy editing. 256GB of storage suits students who use cloud storage; choose 512GB if you keep photos, videos or large files on the laptop. Compare every model on the [MacBook price page](/mac), or read [MacBook Air or MacBook Pro](/journal/macbook-air-or-macbook-pro) and the full [MacBook price list](/journal/macbook-price-in-kenya).",
    ],
    faq: [
      { q: "What is the best MacBook to buy in Kenya?", a: "For most people, the MacBook Air 13-inch M4 from {{price:macbook-air-13-m4}}. For video editing or coding, a MacBook Pro 14-inch from {{price:macbook-pro-14-m4}}." },
      { q: "Which MacBook is best for university students?", a: "The MacBook Air 13-inch M4, or an Ex-UK MacBook Air M1 from {{exuk:macbook-air-13-m1}} on a budget." },
      { q: "Is the MacBook Air good for video editing?", a: "It handles light editing well. For long or 4K projects, choose a MacBook Pro, which has a fan for sustained performance." },
      { q: "What is the cheapest MacBook in Kenya?", a: "At Gadget Hub, the Ex-UK MacBook Air M1 from {{exuk:macbook-air-13-m1}}." },
      { q: "Can I buy a MacBook on instalments in Kenya?", a: "Yes, with Lipa Mdogo Mdogo: pay a deposit, then the balance monthly." },
    ],
  },
  {
    ...base,
    id: "j-best-ipad-students-kenya",
    slug: "best-ipad-for-students-in-kenya",
    title:
      "Best iPad for Students in Kenya 2026: Best iPad for University, Note-Taking, Online Classes and Drawing, with iPad and Apple Pencil Prices in Nairobi",
    seoTitle:
      "Best iPad for Students in Kenya 2026 | Best iPad for University, Note-Taking & Drawing | iPad & Apple Pencil Prices Nairobi | Gadget Hub",
    excerpt:
      "Which iPad is best for studying? Our picks for university, note-taking, online classes and drawing — from iPad A16 at {{price:ipad-a16}} to iPad Air M4 — plus which Apple Pencil works with each.",
    seoDescription:
      "Best iPad for students in Kenya: iPad A16 for budget, iPad Air M4 for university and note-taking, iPad Pro for drawing. iPad and Apple Pencil prices in Nairobi at Gadget Hub.",
    tags: ["best iPad for students Kenya", "best iPad for university", "best iPad for note taking", "iPad for online classes Kenya", "best iPad for drawing"],
    coverAlt: "iPad with Apple Pencil for studying",
    paragraphs: [
      "“Best iPad for studies”, “best iPad for university Kenya”, “iPad for note-taking” — an iPad can replace a bag of exercise books, textbooks and a laptop for many students. Which one you need depends on how you study. Prices below are live from our shop.",
      "## Best iPad for most students: iPad (A16)",
      "The [iPad (A16)](/ipad/ipad-a16) from {{price:ipad-a16}} handles notes, PDFs, online classes on Zoom or Google Meet, Office apps and streaming without trouble. It works with the [Apple Pencil (USB-C)](/accessories/pencil-usbc) at {{price:pencil-usbc}} for handwritten notes. This is the iPad we recommend for secondary school and most university courses.",
      "## Best iPad for university and heavy note-taking: iPad Air",
      "The [iPad Air 11-inch M4](/ipad/ipad-air-11-m4) from {{price:ipad-air-11-m4}} is faster, has a better display and supports the [Apple Pencil Pro](/accessories/pencil-pro) ({{price:pencil-pro}}), which makes handwriting feel natural in GoodNotes or Notability. Add a [Magic Keyboard for iPad Air](/accessories/keyboard-ipad-air-11) and it doubles as a laptop for essays. For engineering, architecture or medicine students who read large diagrams, the [iPad Air 13-inch](/ipad/ipad-air-13-m4) gives more space.",
      "## Best small iPad: iPad mini",
      "The [iPad mini (A17 Pro)](/ipad/ipad-mini-a17-pro) from {{price:ipad-mini-a17-pro}} fits in one hand and is ideal for reading, quick notes and carrying between lectures. It also works with the Apple Pencil Pro.",
      "## Best iPad for drawing and design students",
      "Art, design and architecture students get the most from the [iPad Pro 11-inch M5](/ipad/ipad-pro-11-m5) from {{price:ipad-pro-11-m5}}: the smoothest display for drawing in Procreate, the fastest chip, and Apple Pencil Pro support.",
      "## Budget tips for students",
      "Ex-UK iPads cost less: the [iPad (10th gen)](/ipad/ipad-10) Ex-UK starts at {{exuk:ipad-10}} and the [iPad (9th gen)](/ipad/ipad-9) Ex-UK at {{exuk:ipad-9}}. Wi-Fi models are enough for most students; choose Cellular only if you study away from Wi-Fi. Spread the cost with [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo), and see [setting up your new iPad](/journal/setting-up-your-new-ipad) once it arrives. Full prices: [iPad price list](/journal/ipad-price-in-kenya).",
    ],
    faq: [
      { q: "Which iPad is best for students in Kenya?", a: "The iPad (A16) from {{price:ipad-a16}} for most students; the iPad Air M4 from {{price:ipad-air-11-m4}} for university and heavy note-taking." },
      { q: "Which Apple Pencil works with the iPad A16?", a: "The Apple Pencil (USB-C), {{price:pencil-usbc}} at Gadget Hub." },
      { q: "Is an iPad good for university instead of a laptop?", a: "For notes, reading and online classes, yes. Add a keyboard for essays. Courses that need Windows-only or heavy desktop software are better served by a laptop." },
      { q: "What is the cheapest iPad in Kenya?", a: "At Gadget Hub, the Ex-UK iPad (9th gen) from {{exuk:ipad-9}}." },
      { q: "Which iPad is best for drawing?", a: "The iPad Pro 11-inch M5 from {{price:ipad-pro-11-m5}} with the Apple Pencil Pro." },
    ],
  },
  {
    ...base,
    id: "j-apple-gift-ideas-kenya",
    slug: "best-apple-gifts-in-kenya",
    title:
      "Best Apple Gifts in Kenya 2026: Best iPad, AirPods, Apple Watch and iPhone to Surprise Someone, Gift Ideas by Budget in Nairobi",
    seoTitle:
      "Best Apple Gift Ideas in Kenya 2026 | Best iPad, AirPods, Apple Watch & iPhone to Surprise Someone | Gifts by Budget Nairobi | Gadget Hub",
    excerpt:
      "Apple gift ideas for every budget in Nairobi — AirPods from {{price:airpods-4}}, Apple Watch from {{price:watch-se3-40}}, iPad from {{price:ipad-a16}} — and which iPad is best to surprise someone.",
    seoDescription:
      "Best Apple gifts in Kenya by budget: AirPods, Apple Watch, iPad and iPhone gift ideas for birthdays, graduation and Christmas. Genuine Apple, delivered in Nairobi by Gadget Hub.",
    tags: ["best iPad to surprise someone", "Apple gift ideas Kenya", "best gift for her Kenya", "best gift for him Kenya", "graduation gift Kenya"],
    coverAlt: "Apple gifts: iPad, AirPods and Apple Watch",
    paragraphs: [
      "Birthdays, graduations, anniversaries and Christmas bring the same search: “best iPad to surprise someone”, “Apple gift for her Kenya”, “graduation gift ideas”. Apple products make memorable gifts because they are useful every day. Here are our picks by budget, with live prices.",
      "## Gifts under KES 25,000",
      "[AirPods 4](/airpods/airpods-4) at {{price:airpods-4}} are the easiest gift to get right — everyone with a phone uses them. [AirPods 5](/airpods/airpods-5) are {{price:airpods-5}}. A [HomePod mini](/tv-home/homepod-mini) at {{price:homepod-mini}} is a great gift for music lovers.",
      "## Gifts under KES 50,000",
      "[AirPods Pro 3](/airpods/airpods-pro-3) at {{price:airpods-pro-3}} add noise cancellation, perfect for matatu rides and flights. The [Apple Watch SE 3](/watch/watch-se3-40) from {{price:watch-se3-40}} tracks fitness, sleep and heart rate, and shows WhatsApp notifications on the wrist (it needs an iPhone).",
      "## The best iPad to surprise someone",
      "The [iPad (A16)](/ipad/ipad-a16) from {{price:ipad-a16}} is the iPad we recommend as a gift: big enough for films and video calls with family, simple enough for children and parents, and fast enough for students. For a creative person, add an [Apple Pencil (USB-C)](/accessories/pencil-usbc). For someone special who reads a lot, the [iPad mini](/ipad/ipad-mini-a17-pro) from {{price:ipad-mini-a17-pro}} is a lovely surprise. Read our [best iPad for students](/journal/best-ipad-for-students-in-kenya) guide for more.",
      "## Bigger gifts: iPhone, Apple Watch Series and MacBook",
      "For graduations and big milestones: the [iPhone 17](/iphone/iphone-17) from {{price:iphone-17}}, the [Apple Watch Series 11](/watch/watch-s11-42) from {{price:watch-s11-42}}, or a [MacBook Air](/mac/macbook-air-13-m4) from {{price:macbook-air-13-m4}} to start a career. You can spread a big gift with [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo).",
      "## Gift tips",
      "Check the person uses an iPhone before buying an Apple Watch. Buy sealed new so they can set it up with their own Apple ID. Keep the invoice for warranty. Collect at Norwich Union House, Nairobi CBD, or have it delivered in Nairobi — order on the site and add the recipient's details in the delivery address.",
    ],
    faq: [
      { q: "What is the best Apple gift under 25,000 shillings?", a: "AirPods 4 at {{price:airpods-4}}, or a HomePod mini at {{price:homepod-mini}}." },
      { q: "Which iPad is best to surprise someone with?", a: "The iPad (A16) from {{price:ipad-a16}} for most people; the iPad mini from {{price:ipad-mini-a17-pro}} for readers." },
      { q: "Does an Apple Watch work with Android?", a: "No. An Apple Watch needs an iPhone to set up and use." },
      { q: "Can Gadget Hub deliver a gift in Nairobi?", a: "Yes. Order online, choose Delivery and enter the recipient's address; delivery is arranged after payment." },
      { q: "Can I buy a gift in instalments?", a: "Yes, with Lipa Mdogo Mdogo for larger items such as iPhone, iPad and MacBook." },
    ],
  },
];
