import { site } from "../../site";

/** Shared FAQ shown on every iPhone SEO product page (not stored per model). */
export const sharedProductFaq = [
  {
    question: "Where are you?",
    answer: `Gadget Hub is at ${site.address}, ${site.location}. See the locations page for the map and hours.`,
    href: "/locations",
  },
  {
    question: "How do I pay?",
    answer:
      "Pay in full by M-Pesa or card through our payment gateway once live. You can also order on WhatsApp.",
    href: "/faqs",
  },
  {
    question: "Can I pay in installments?",
    answer:
      "Yes. Lipa Mdogo Mdogo is run in-house by Gadget Hub Investments. Ask on WhatsApp for a plan on your model.",
    href: "/lipa-mdogo-mdogo",
  },
  {
    question: "Can I trade in my old phone?",
    answer:
      "Bring an iPhone or Samsung and get credit toward this phone. We quote on WhatsApp and confirm after inspecting your device.",
    href: "/trade-in",
  },
  {
    question: "Do you deliver outside Nairobi?",
    answer:
      "See the shipping and delivery page for current coverage and options. We confirm delivery details on WhatsApp before you pay.",
    href: "/shipping-delivery",
  },
] as const;

export const buyingBlock = {
  payment:
    "Pay in full by M-Pesa or card once our gateway is live, or arrange Lipa Mdogo Mdogo (run in-house by Gadget Hub Investments).",
  delivery:
    "Delivery details follow the shipping and delivery page. We confirm charge and timing on WhatsApp before you pay.",
  warranty: "Covered by the manufacturer's standard warranty.",
  hours: site.hours.short,
  tradeIn:
    "Bring an iPhone or Samsung and get credit toward this phone. Our team quotes you on WhatsApp and confirms the value after inspecting your device.",
} as const;
