/**
 * How-to and buying-checklist posts, phrased the way Kenyans search
 * (Google autocomplete, gl=ke, Oct 2026): "what information do you need to set up
 * a new iPhone", "transfer photos from android to iphone after setup",
 * "transfer files from windows to macbook", "things to check before buying iphone".
 * Every post ends with where readers get served: Gadget Hub, Norwich Union House.
 * Prices are live placeholders ({{price:id[:option]}} / {{exuk:id[:option]}}).
 */
import type { JournalPost } from "./journal";

const base = {
  author: "GadgetHub",
  status: "published" as const,
  date: "2026-10-26",
  dateLabel: "26 Oct 2026",
  views: 0,
};
const howTo = { ...base, category: "How-to guides" };
const buying = { ...base, category: "Buying guides" };

const served = (help: string) => [
  "## Get help at Gadget Hub, Norwich Union House, 4th Floor",
  `Gadget Hub is at Norwich Union House, opposite the Hilton Hotel, 4th Floor, Suite 15, Nairobi CBD (Mon–Sat 8am–8pm, Sun 10am–8pm). ${help} The set-up fee, where one applies, is confirmed before we start. WhatsApp or call 0729 585 471.`,
];

export const journalHowToGuidePosts: JournalPost[] = [
  {
    ...howTo,
    id: "j-setup-new-iphone",
    slug: "what-you-need-to-set-up-a-new-iphone",
    title:
      "What You Need to Set Up a New iPhone in Kenya: Apple Account Credentials, Wi-Fi, SIM or eSIM, Passcode and Your Old Phone — Complete iPhone Setup Checklist",
    seoTitle:
      "What Do You Need to Set Up a New iPhone? Apple ID / Apple Account, Wi-Fi, SIM & eSIM, Passcode | New iPhone Setup Checklist Kenya | Gadget Hub",
    excerpt:
      "Everything you need before you switch on a new iPhone: your Apple Account email and password, Wi-Fi or mobile data, your SIM or eSIM, a passcode, and your old phone or backup — step by step.",
    seoDescription:
      "What information do you need to set up a new iPhone? Apple Account (Apple ID) email and password, Wi-Fi or data, Safaricom or Airtel SIM/eSIM, a passcode and your old phone or iCloud backup. Full checklist.",
    tags: ["what do you need to set up a new iPhone", "set up new iPhone", "do you need wifi to set up iPhone", "Apple ID", "new iPhone setup Kenya"],
    coverAlt: "Setting up a new iPhone",
    paragraphs: [
      "“What do you need to set up a new iPhone?”, “what information do you need to set up a new iPhone?” and “do you need Wi-Fi to set up a new iPhone?” are among the most common questions from new iPhone owners in Kenya. Here is the full checklist, so setup takes minutes instead of an afternoon.",
      "## 1. Your Apple Account email and password (Apple ID)",
      "Apple now calls the Apple ID your Apple Account. It is the email address and password that holds your iCloud photos, contacts, App Store purchases and WhatsApp backup. If you already have one, have the password ready, plus access to the phone number or trusted device that receives the verification code. If you don't, you can create one during setup — our guide to [creating an Apple Account in Kenya](/journal/create-apple-id-apple-account-kenya) explains what you need.",
      "## 2. Wi-Fi or mobile data",
      "Yes, you need an internet connection: the iPhone has to activate with Apple before you can use it. Home or office Wi-Fi is easiest. If you have no Wi-Fi, insert your SIM first — the iPhone can activate over mobile data.",
      "## 3. Your SIM card or eSIM",
      "Have your Safaricom, Airtel or Telkom SIM and a SIM ejector pin (it comes in the box). Some newer iPhones use eSIM; Safaricom and Airtel can issue or transfer an eSIM, and many iPhones can move your number from your old iPhone during setup. Keep your ID handy in case your network asks you to re-verify.",
      "## 4. Your old phone or a backup",
      "Moving from another iPhone? Keep the old one charged and nearby for Quick Start, or make sure it has a recent iCloud backup — see [moving from your old iPhone](/journal/transfer-data-old-iphone-to-new-iphone). Coming from Android? Keep the Android charged on the same Wi-Fi and use Move to iOS — see [switching from Samsung to iPhone](/journal/switch-from-samsung-to-iphone-kenya).",
      "## 5. A passcode and Face ID",
      "Choose a six-digit passcode you will remember — you will need it after every restart and for updates. Then set up Face ID. Never share your passcode with a seller or repair stall.",
      "## 6. A charger and a little time",
      "Plug the iPhone into a USB-C charger during setup (a cable comes in the box; the power adapter is sold separately). Allow 15–30 minutes for a fresh setup, longer if you are moving many photos.",
      "## After setup",
      "Sign in to WhatsApp with your number, install M-PESA and your bank apps, turn on iCloud Backup, and enable Find My so you can locate or lock the phone if it is lost.",
      ...served("Buy your iPhone with us and we can set it up, activate your SIM or eSIM and move your data before you leave."),
    ],
    faq: [
      { q: "What information do you need to set up a new iPhone?", a: "Your Apple Account (Apple ID) email and password, a Wi-Fi or mobile data connection, your SIM or eSIM, and a passcode. Your old phone or an iCloud backup if you want to move your data." },
      { q: "Do you need Wi-Fi to set up a new iPhone?", a: "You need an internet connection to activate it. Wi-Fi is easiest, but with your SIM inserted the iPhone can activate over mobile data." },
      { q: "Can I set up an iPhone without an Apple ID?", a: "Yes, you can skip it, but you won't be able to download apps or back up to iCloud until you sign in or create an Apple Account." },
      { q: "Can I set up a new iPhone without my old phone?", a: "Yes. Restore from an iCloud backup, or set it up as new and sign in with your Apple Account to bring back iCloud data." },
      { q: "Can Gadget Hub set up my iPhone for me?", a: "Yes, at Norwich Union House, 4th Floor, Suite 15. The set-up fee is confirmed before we start." },
    ],
  },
  {
    ...howTo,
    id: "j-create-apple-account-kenya",
    slug: "create-apple-id-apple-account-kenya",
    title:
      "How to Create an Apple ID (Apple Account) in Kenya: Email, Password, Phone Number Verification and Payment Options — Credentials You Need for iPhone, iPad and MacBook",
    seoTitle:
      "How to Create Apple ID in Kenya | Apple Account Email, Password & Phone Verification | Credentials for iPhone, iPad & MacBook | Gadget Hub",
    excerpt:
      "The credentials behind every iPhone, iPad and MacBook: how to create an Apple Account (Apple ID) in Kenya, what email and phone number to use, and how to keep it safe.",
    seoDescription:
      "Create an Apple ID / Apple Account in Kenya: use an email you control, a strong password and your Kenyan phone number for two-factor verification. Payment method optional. Step-by-step guide.",
    tags: ["create Apple ID Kenya", "Apple Account", "Apple ID credentials", "Apple ID password", "two-factor authentication"],
    coverAlt: "Creating an Apple Account",
    paragraphs: [
      "Your Apple Account — still widely called an Apple ID — is the single most important credential for any Apple device. It holds your iCloud photos and backups, App Store apps and Find My. People search “create Apple ID Kenya” because the steps are easy to get wrong. Here is what you need.",
      "## What you need",
      "An email address you control and will keep for years (Gmail is fine), a strong password you have not used elsewhere, your Kenyan phone number for verification codes, and your date of birth. A payment method is optional — you can download free apps without one.",
      "## How to create it on an iPhone or iPad",
      "During setup, tap “Forgot password or don't have an Apple Account?” then “Create a Free Apple Account”. Or, on a phone that is already set up, open Settings, tap “Sign in to your iPhone”, then create a new account. Enter your name, date of birth and email, choose a password, then confirm your phone number with the code Apple sends. Choose Kenya as your country or region so the App Store shows Kenyan apps such as M-PESA and your bank.",
      "## How to create it on a MacBook",
      "Open System Settings, click “Sign in with your Apple Account”, then “Create Apple Account”, and follow the same steps. On a new Mac you can do this during setup.",
      "## Keep it safe",
      "Two-factor authentication is on by default — keep the phone number current. Never share your Apple Account password with a seller or repair stall, and never buy a phone that is still signed in to someone else's account. Write your email and password down and keep them somewhere safe at home: if you forget them, recovering the account can take days.",
      ...served("If you are buying a new device, we can help you create your Apple Account at the counter — you type the password yourself."),
    ],
    faq: [
      { q: "Can I create an Apple ID in Kenya?", a: "Yes. Choose Kenya as your country or region, use an email you control and verify with your Kenyan phone number." },
      { q: "Do I need a credit card to create an Apple ID?", a: "No. A payment method is optional; you can download free apps without one." },
      { q: "What is the difference between Apple ID and Apple Account?", a: "They are the same thing. Apple renamed the Apple ID to Apple Account." },
      { q: "What happens if I forget my Apple ID password?", a: "Reset it from your trusted device or phone number. Keep your email and phone number current so recovery is quick." },
    ],
  },
  {
    ...howTo,
    id: "j-old-iphone-to-new-iphone",
    slug: "transfer-data-old-iphone-to-new-iphone",
    title:
      "How to Transfer Data from Your Old iPhone to a New iPhone: Quick Start, iCloud Backup, Cable Transfer and Moving After Setup — Photos, WhatsApp and Contacts",
    seoTitle:
      "Transfer Data from Old iPhone to New iPhone | Quick Start, iCloud Backup, With Cable & After Setup | Move Photos, WhatsApp & Contacts | Gadget Hub",
    excerpt:
      "Three ways to move everything from your old iPhone to your new one — Quick Start, iCloud backup and cable — plus what to do if you already set up the new phone, and how iCloud storage works.",
    seoDescription:
      "Move from old iPhone to new iPhone: Quick Start phone-to-phone, restore from iCloud backup, or transfer with a cable. Fix 'after setup' and 'not enough iCloud storage' problems. Help at Gadget Hub Nairobi.",
    tags: ["transfer data old iPhone to new iPhone", "Quick Start iPhone", "iCloud backup iPhone", "transfer data after setup", "move WhatsApp to new iPhone"],
    coverAlt: "Quick Start between two iPhones",
    paragraphs: [
      "“Transfer data from old iPhone to new iPhone”, “set up new iPhone from old iPhone”, “transfer after setup” and “iCloud backup not enough storage” are what people search on the day they get a new iPhone. Here are the three methods and when to use each.",
      "## Method 1: Quick Start (phone to phone)",
      "Charge both phones, turn on Bluetooth and Wi-Fi on the old one, and place the new iPhone next to it. A Quick Start card appears on the old phone; follow it, scan the animation, enter your old passcode, and choose “Transfer from iPhone”. Everything moves directly: apps, photos, messages, settings and WhatsApp. Keep both phones close and plugged in until it finishes.",
      "## Method 2: Restore from an iCloud backup",
      "On the old iPhone open Settings › [your name] › iCloud › iCloud Backup and tap Back Up Now. On the new iPhone choose “From iCloud Backup” during setup and sign in. This is the option when the old phone is broken or lost. Apple gives 5GB of free iCloud storage; if your backup is bigger, buy a month of iCloud+ storage or use Quick Start instead.",
      "## Method 3: With a cable",
      "If Wi-Fi is slow, connect the two iPhones with a USB-C cable (or USB-C to Lightning for older phones) during Quick Start and the transfer runs over the wire, often faster.",
      "## Already set up the new iPhone?",
      "You can't run Quick Start on a phone that is already set up without erasing it. Either go to Settings › General › Transfer or Reset iPhone › Erase All Content and Settings and start again with Quick Start, or sign in with the same Apple Account so iCloud photos, contacts and notes sync across.",
      "## WhatsApp",
      "WhatsApp moves with Quick Start and iCloud backup. To be safe, open WhatsApp › Settings › Chats › Chat Backup on the old phone and back up first.",
      "## Before you sell or trade in the old iPhone",
      "Sign out of your Apple Account, turn off Find My, then erase it. Bring it in for [trade-in](/trade-in) and we'll put its value toward the new one.",
      ...served("We move your data from your old iPhone to the new one at the counter, and value the old one for trade-in."),
    ],
    faq: [
      { q: "How do I transfer everything from my old iPhone to my new iPhone?", a: "Use Quick Start: put the phones side by side, follow the card on the old phone and choose Transfer from iPhone." },
      { q: "Can I transfer data after setting up my new iPhone?", a: "Only by erasing the new iPhone and running Quick Start again, or by syncing iCloud data with the same Apple Account." },
      { q: "What if my iCloud storage is full?", a: "Use Quick Start, which doesn't need iCloud storage, or buy temporary iCloud+ storage for the backup." },
      { q: "Will WhatsApp chats move to my new iPhone?", a: "Yes, with Quick Start or an iCloud backup. Back up WhatsApp on the old phone first." },
    ],
  },
  {
    ...howTo,
    id: "j-android-photos-files-to-iphone",
    slug: "transfer-photos-and-files-from-android-to-iphone",
    title:
      "How to Transfer Photos, Videos and Files from Android to iPhone: Move to iOS, Google Photos, Google Drive, With a Computer and After Setup",
    seoTitle:
      "Transfer Photos from Android to iPhone | Wirelessly, After Setup, Without Computer | Move Files & Videos from Samsung to iPhone | Gadget Hub",
    excerpt:
      "Four ways to move photos, videos and documents from Android or Samsung to iPhone — during setup with Move to iOS, or after setup with Google Photos, Google Drive or a computer.",
    seoDescription:
      "How to transfer photos and files from Android to iPhone, during setup with Move to iOS or after setup with Google Photos, Google Drive or a computer. Samsung to iPhone help at Gadget Hub, Nairobi CBD.",
    tags: ["transfer photos from Android to iPhone", "transfer photos after setup", "move files Samsung to iPhone", "Android to iPhone wirelessly", "Move to iOS"],
    coverAlt: "Moving photos from Android to iPhone",
    paragraphs: [
      "Photos are what people worry about most when they switch. Searches like “transfer photos from Android to iPhone wirelessly”, “after setup” and “without computer” show there is more than one situation. Pick the method that matches yours.",
      "## During setup: Move to iOS",
      "If the iPhone is new or freshly erased, Apple's Move to iOS app on the Android phone moves photos, videos, contacts, messages, WhatsApp and more over Wi-Fi. Keep both phones charged and on the same Wi-Fi. Full steps: [switching from Samsung to iPhone](/journal/switch-from-samsung-to-iphone-kenya).",
      "## After setup, wirelessly: Google Photos",
      "Already using the iPhone? On Android, open Google Photos and make sure Backup is on. On the iPhone, install Google Photos, sign in with the same Google account, and your whole library appears. To save copies into the iPhone's own Photos app, select the photos and tap Download. Large libraries need good Wi-Fi.",
      "## Documents and other files: Google Drive or Files",
      "Upload PDFs, Word documents and other files to Google Drive on Android, then open the Google Drive app on the iPhone, or add Drive as a location in the iPhone's Files app.",
      "## With a computer and cable",
      "Connect the Android to a computer, copy the DCIM folder (your camera photos) to the computer, then import them to the iPhone through iCloud Photos (icloud.com) on Windows or the Photos app on a Mac. It's the most reliable way to move tens of thousands of photos.",
      "## Tips",
      "Free up space first: an iPhone with 128GB fills quickly if you bring years of WhatsApp media. Check your storage choice in [things to know before buying an iPhone](/journal/things-to-know-before-buying-an-iphone-2026). For contacts, see [moving contacts from Android to iPhone](/journal/transfer-contacts-android-to-iphone-and-windows-to-mac).",
      ...served("Bring both phones and we'll move your photos and files for you."),
    ],
    faq: [
      { q: "How do I transfer photos from Android to iPhone after setup?", a: "Back up to Google Photos on Android, then sign in to Google Photos on the iPhone and download the photos you want." },
      { q: "Can I transfer photos from Android to iPhone without a computer?", a: "Yes, with Move to iOS during setup or Google Photos after setup." },
      { q: "Does AirDrop work from Android to iPhone?", a: "No. AirDrop is Apple-only. Use Move to iOS, Google Photos or Google Drive instead." },
      { q: "Will my videos move too?", a: "Yes. Move to iOS and Google Photos move videos as well as photos." },
    ],
  },
  {
    ...howTo,
    id: "j-move-contacts",
    slug: "transfer-contacts-android-to-iphone-and-windows-to-mac",
    title:
      "How to Move Contacts from Android to iPhone (Even After Setup) and from a Windows Laptop to a MacBook: Gmail Sync, Move to iOS, SIM and VCF Files",
    seoTitle:
      "Transfer Contacts from Android to iPhone | After Setup, Using Gmail, SIM & VCF | Move Contacts from Windows to MacBook | Gadget Hub Kenya",
    excerpt:
      "Your contacts matter more than any app. How to move them from Android to iPhone with Gmail, Move to iOS or a VCF file — and from a Windows laptop to a MacBook.",
    seoDescription:
      "Move contacts from Android to iPhone after setup using Gmail sync, Move to iOS or a VCF file, and from Windows to MacBook with Migration Assistant or iCloud. Simple steps for Kenyan users.",
    tags: ["transfer contacts Android to iPhone", "contacts after setup", "Android contacts to iPhone using Gmail", "contacts Windows to Mac", "import VCF iPhone"],
    coverAlt: "Contacts moving to iPhone",
    paragraphs: [
      "“Transfer contacts Android to iPhone after setup” and “using Gmail” are top searches because many people set up their iPhone first and then realise their contacts are missing. Here is how to bring them across.",
      "## Android to iPhone: Gmail sync (works after setup)",
      "On Android, check Settings › Accounts › Google › Account sync and make sure Contacts is on. On the iPhone, open Settings › Apps › Contacts › Contacts Accounts (or Settings › Mail › Accounts on older iOS), add your Google account and switch Contacts on. Your contacts appear within minutes.",
      "## Android to iPhone: Move to iOS (during setup)",
      "If the iPhone is new or erased, Move to iOS brings contacts along with photos and messages. See [switching from Samsung to iPhone](/journal/switch-from-samsung-to-iphone-kenya).",
      "## Contacts saved only on the SIM or phone",
      "Contacts stored only on the phone or SIM won't sync. On Android open Contacts › Manage contacts › Export, save a .vcf file, then send it to yourself by email and open it on the iPhone to import all contacts. On iPhone you can also go to Settings › Apps › Contacts › Import SIM Contacts with the old SIM inserted.",
      "## Windows laptop to MacBook",
      "Apple's Migration Assistant moves contacts from Outlook and Windows along with your files — see [moving files from Windows to MacBook](/journal/transfer-files-from-windows-to-macbook). If your contacts live in Gmail or Outlook.com, just add that account in System Settings › Internet Accounts on the Mac and they sync automatically.",
      ...served("Bring your old phone or laptop and we'll make sure every contact arrives."),
    ],
    faq: [
      { q: "How do I transfer contacts from Android to iPhone after setup?", a: "Sync contacts to your Google account on Android, then add the Google account on the iPhone and switch Contacts on." },
      { q: "How do I move contacts from my SIM card to iPhone?", a: "Insert the SIM and go to Settings › Apps › Contacts › Import SIM Contacts." },
      { q: "Can I transfer contacts with Bluetooth?", a: "Bluetooth transfer between Android and iPhone is not supported. Use Gmail sync or a VCF file." },
      { q: "How do I move contacts from Windows to a MacBook?", a: "Use Migration Assistant, or add your Gmail or Outlook account in Internet Accounts on the Mac." },
    ],
  },
  {
    ...howTo,
    id: "j-windows-files-to-mac",
    slug: "transfer-files-from-windows-to-macbook",
    title:
      "How to Transfer Files, Photos and Documents from a Windows Laptop to a MacBook: Migration Assistant, Over Wi-Fi, With a USB Cable or Flash Disk, and Cloud",
    seoTitle:
      "Transfer Files from Windows to Mac | Windows to MacBook Over Wi-Fi, USB Cable or Flash Disk | Migration Assistant & OneDrive | Gadget Hub Kenya",
    excerpt:
      "Moving from a Windows laptop to a MacBook? Four ways to bring your documents, photos and music across — Migration Assistant, flash disk, cable and cloud — and what won't move.",
    seoDescription:
      "Move files from Windows to MacBook: Apple's Migration Assistant over Wi-Fi, a USB flash disk or external drive, OneDrive or Google Drive. Help moving to Mac at Gadget Hub, Norwich Union House, Nairobi.",
    tags: ["transfer files from Windows to Mac", "Windows to MacBook over WiFi", "Migration Assistant Windows", "move files to MacBook", "Windows to Mac USB"],
    coverAlt: "Moving files from Windows to MacBook",
    paragraphs: [
      "“Transfer files from Windows to Mac”, “over Wi-Fi”, “using a cable” and “via USB-C” are what new MacBook owners search. Here are four ways, from the most complete to the quickest.",
      "## 1. Apple's Migration Assistant (most complete)",
      "Download “Windows Migration Assistant” from Apple's website onto the Windows PC and run it. On the Mac, open Migration Assistant (Applications › Utilities) and choose “From a Windows PC”. With both on the same Wi-Fi, select what to bring: documents, photos, music, desktop files, contacts, calendars and email accounts. Large transfers can take a few hours — leave both plugged in.",
      "## 2. Flash disk or external hard drive",
      "Copy your folders to a flash disk or external drive on Windows, then plug it into the MacBook (use a USB-C adapter if the drive is USB-A) and drag the files into Finder. Format the drive as exFAT if you want to use it on both Windows and Mac.",
      "## 3. Cloud: OneDrive, Google Drive or iCloud",
      "If your files already sync to OneDrive or Google Drive, install the same app on the Mac and sign in. To use iCloud, install iCloud for Windows, turn on iCloud Drive and Photos, and the files appear on the Mac when you sign in with the same Apple Account.",
      "## 4. Photos only",
      "Copy the Pictures folder with any method above, then open the Photos app on the Mac and choose File › Import. Or use iCloud Photos from Windows so your library syncs to the Mac automatically.",
      "## What won't move",
      "Windows programs (.exe files) don't run on a Mac. Download the Mac versions of Microsoft Office, Chrome, Zoom, WhatsApp and similar apps; many are free in the Mac App Store. Choosing a Mac? See [things to know before buying a MacBook](/journal/things-to-know-before-buying-a-macbook).",
      ...served("Buy your MacBook with us and we can move your files from the Windows laptop before you take it home."),
    ],
    faq: [
      { q: "How do I transfer files from Windows to Mac over Wi-Fi?", a: "Run Windows Migration Assistant on the PC and Migration Assistant on the Mac, with both on the same Wi-Fi network." },
      { q: "Can I use a flash disk to move files to a MacBook?", a: "Yes. Copy files on Windows, then plug the disk into the Mac (with a USB-C adapter if needed). Use exFAT format for both systems." },
      { q: "Will my Windows programs work on a MacBook?", a: "No. Install the Mac versions; Office, Chrome, Zoom and WhatsApp all have Mac apps." },
      { q: "How do I move photos from Windows to a MacBook?", a: "Copy the Pictures folder and import it in the Mac Photos app, or sync with iCloud Photos from Windows." },
    ],
  },
  {
    ...howTo,
    id: "j-setup-new-macbook",
    slug: "what-you-need-to-set-up-a-new-macbook",
    title:
      "What You Need to Set Up a New MacBook Air or MacBook Pro: Apple Account Credentials, Wi-Fi, Admin Password, Touch ID, FileVault and Moving From Your Old Laptop",
    seoTitle:
      "What Do You Need to Set Up a New MacBook? Apple ID, Wi-Fi, Admin Password & Touch ID | Setting Up New MacBook Air & Pro | Gadget Hub Kenya",
    excerpt:
      "The checklist for a new MacBook Air or Pro: your Apple Account credentials, Wi-Fi, an admin account and password, Touch ID, FileVault, and moving files from your old Mac or Windows laptop.",
    seoDescription:
      "Setting up a new MacBook Air or MacBook Pro: what you need (Apple Account, Wi-Fi, admin password), Touch ID, FileVault, iCloud and Migration Assistant from an old Mac or Windows PC. Help in Nairobi.",
    tags: ["setting up new MacBook Air", "set up new MacBook Pro", "what do you need to set up a MacBook", "MacBook admin password", "Migration Assistant"],
    coverAlt: "Setting up a new MacBook",
    paragraphs: [
      "“Setting up a new MacBook Air”, “setting up a new MacBook Pro” and “setting up a new MacBook from an old MacBook” are what new Mac owners search. Here is everything you need before you open the lid.",
      "## What to have ready",
      "Your Apple Account (Apple ID) email and password and access to its verification codes; your Wi-Fi name and password; a name and password for the Mac's administrator account (you will type it to install apps and updates — write it down); and your old laptop or backup if you want to move files.",
      "## Step by step",
      "Choose your country (Kenya) and language, join Wi-Fi, then decide whether to transfer data now. Sign in with your Apple Account, create the admin account, set up Touch ID by placing a finger on the power button, and turn on FileVault, which encrypts your files if the Mac is lost. Choose whether to share Siri and analytics, pick light or dark mode, and you're at the desktop.",
      "## Moving from an old Mac or a Windows laptop",
      "From an old Mac, Migration Assistant moves your apps, files and settings — select it during setup or later in Applications › Utilities. From Windows, use Windows Migration Assistant: see [moving files from Windows to MacBook](/journal/transfer-files-from-windows-to-macbook).",
      "## After setup",
      "Run Software Update in System Settings › General, install Microsoft Office or Google Workspace, sign in to iCloud Drive so your Desktop and Documents are backed up, and turn on Find My Mac. If you have an iPhone, AirDrop, copy-paste and iMessage now work across both.",
      ...served("Buy your MacBook with us and we'll set it up and move your files from your old laptop before you leave."),
    ],
    faq: [
      { q: "What do I need to set up a new MacBook?", a: "Your Apple Account email and password, Wi-Fi, and a name and password for the Mac's admin account. Your old laptop or a backup if you want to move files." },
      { q: "Do I need an Apple ID to use a MacBook?", a: "You can skip it during setup, but you need an Apple Account for the App Store, iCloud and Find My." },
      { q: "How do I move everything from my old MacBook to a new one?", a: "Use Migration Assistant during setup or later from Applications › Utilities." },
      { q: "What is FileVault?", a: "FileVault encrypts the Mac's storage so your files can't be read if the laptop is lost or stolen." },
    ],
  },
  {
    ...howTo,
    id: "j-setup-new-ipad",
    slug: "what-you-need-to-set-up-a-new-ipad",
    title:
      "What You Need to Set Up a New iPad: Apple Account Credentials, Wi-Fi, Setting Up an iPad With Your iPhone, and Setting Up an iPad for a Child in Kenya",
    seoTitle:
      "What Do You Need to Set Up an iPad? Apple ID, Wi-Fi, Set Up iPad With iPhone & Set Up iPad for Child | Screen Time & Apple Pencil | Gadget Hub",
    excerpt:
      "Setting up a new iPad: the credentials you need, setting it up from your iPhone, setting up an iPad for a child with Screen Time, and pairing an Apple Pencil and keyboard.",
    seoDescription:
      "What you need to set up a new iPad: Apple Account, Wi-Fi, passcode. Set up iPad with iPhone, set up iPad for child with Family Sharing and Screen Time, pair Apple Pencil. Help at Gadget Hub Nairobi.",
    tags: ["set up iPad", "set up iPad for child", "set up iPad with iPhone", "what do you need to set up an iPad", "iPad Screen Time"],
    coverAlt: "Setting up a new iPad",
    paragraphs: [
      "“Set up iPad for child”, “set up iPad with iPhone” and “set up iPad without Apple ID” top Kenyan searches about new iPads. Here is what you need for each.",
      "## What you need",
      "Wi-Fi (or a SIM if it is a Cellular iPad), your Apple Account (Apple ID) email and password, and a passcode. If you own an iPhone, keep it nearby — it makes setup faster.",
      "## Set up an iPad with your iPhone",
      "Place your unlocked iPhone next to the new iPad. Quick Start appears on the iPhone; follow it to copy your Apple Account, Wi-Fi and settings. You can also restore from an iCloud backup of an older iPad.",
      "## Set up an iPad for a child",
      "Don't give a child your own Apple Account. In Settings › Family on your iPhone, create a child account (Family Sharing), then sign the iPad in with it. Turn on Screen Time to set daily limits, block adult content and approve app downloads with “Ask to Buy”. You stay in control from your own phone.",
      "## Set up an iPad without an Apple ID",
      "You can skip signing in, but you won't be able to download apps or back up. For a shared family iPad, a child account or a family member's account is better.",
      "## Apple Pencil and keyboard",
      "Pair an Apple Pencil by attaching it to the iPad's magnetic side, or by connecting the USB-C Pencil with its cable, depending on the model. Check which Pencil fits your iPad on the [Apple Pencil page](/accessories/apple-pencil). Magic Keyboards connect when you attach them. For school and university apps, see [setting up your new iPad](/journal/setting-up-your-new-ipad) and [the best iPad for students](/journal/best-ipad-for-students-in-kenya).",
      ...served("We set up iPads at the counter, including child accounts and Screen Time."),
    ],
    faq: [
      { q: "What do I need to set up a new iPad?", a: "Wi-Fi, your Apple Account email and password, and a passcode. An iPhone nearby makes it faster with Quick Start." },
      { q: "How do I set up an iPad for my child?", a: "Create a child account with Family Sharing on your iPhone, sign the iPad in with it, and turn on Screen Time and Ask to Buy." },
      { q: "Can I set up an iPad without an Apple ID?", a: "Yes, but you can't download apps or use iCloud until you sign in." },
      { q: "How do I connect an Apple Pencil to my iPad?", a: "Attach it to the magnetic side or connect the USB-C Pencil, depending on your iPad model." },
    ],
  },
  {
    ...buying,
    id: "j-before-buying-iphone-2026",
    slug: "things-to-know-before-buying-an-iphone-2026",
    title:
      "Things to Know Before Buying an iPhone in 2026 and Beyond: Storage, New vs Ex-UK, eSIM, Battery Health, iCloud Lock and What to Check When Buying Second Hand in Kenya",
    seoTitle:
      "Things to Know Before Buying an iPhone in 2026 | What to Check When Buying iPhone Second Hand | Storage, eSIM, Battery, iCloud | Gadget Hub Kenya",
    excerpt:
      "Before you pay for any iPhone in Kenya: how much storage you really need, new vs Ex-UK, eSIM, battery health, iCloud lock, updates — and the checks for second-hand phones.",
    seoDescription:
      "Things to know before buying an iPhone in 2026: storage, new vs Ex-UK, eSIM support, battery health, iCloud lock, iOS updates and what to check before buying a second-hand iPhone in Kenya.",
    tags: ["things to know before buying iPhone", "things to check before buying iPhone second hand", "buying iPhone 2026", "what to check when buying used iPhone", "iPhone buying guide Kenya"],
    coverAlt: "Checking an iPhone before buying",
    paragraphs: [
      "“Things to know before buying an iPhone” and “things to check before buying an iPhone second hand” are searched by thousands of Kenyans every month. Use this list before you pay — wherever you buy.",
      "## 1. Storage: buy more than you think",
      "Storage can't be upgraded later. 128GB suits light users who back up to the cloud; 256GB is the sweet spot for most Kenyans, because WhatsApp media and 4K video fill phones fast. Newer models such as the [iPhone 17](/iphone/iphone-17) start at 256GB.",
      "## 2. New or Ex-UK",
      "Sealed new phones come with a 1-year warranty and a fresh battery. Ex-UK phones are genuine UK-used iPhones that cost much less — for example an Ex-UK [iPhone 15 Pro Max](/iphone/iphone-15-pro-max) from {{exuk:iphone-15-pro-max}}. Read [new vs Ex-UK](/journal/new-and-ex-uk-apple-devices).",
      "## 3. SIM, eSIM and networks",
      "Check whether the model takes a physical SIM, eSIM, or eSIM only. Safaricom and Airtel support eSIM, but you'll need to visit or call them to set it up. Every iPhone we sell works on Kenyan networks.",
      "## 4. Software updates",
      "Apple updates iPhones for many years, but older models eventually stop getting new iOS versions, and banking apps follow. In 2026, an iPhone 11 is the oldest we'd recommend; see [old iPhones in Kenya](/journal/iphone-7-8-x-xr-xs-se-price-in-kenya).",
      "## 5. Checks for second-hand and Ex-UK phones",
      "Battery Health above about 80% (Settings › Battery). No “unknown part” messages under Settings › General › About › Parts and Service History. IMEI from *#06# matches the box and invoice. iCloud signed out and Find My off. Face ID, cameras, speakers and your own SIM all tested. Full steps: [how to tell an original iPhone](/journal/how-to-tell-original-iphone-kenya).",
      "## 6. Price, payment and warranty",
      "Compare prices with an established shop, pay a business (not a personal number), and get an invoice with the serial number. If paying in full is hard, use [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo); if you have an old phone, use [trade-in](/trade-in). Which model? See [the best iPhone to buy in Kenya](/journal/best-iphone-to-buy-in-kenya).",
      ...served("Come in and we'll run every check on this list with you before you pay."),
    ],
    faq: [
      { q: "What should I check before buying a second-hand iPhone?", a: "Battery health, Parts and Service History, IMEI matching the box and invoice, iCloud signed out, and Face ID, cameras and your SIM working." },
      { q: "How much storage do I need on an iPhone?", a: "256GB for most people; 128GB if you back up to the cloud and don't shoot much video." },
      { q: "Is an Ex-UK iPhone a good idea?", a: "Yes, if bought from a shop that checks it and states the condition on your invoice. It saves a lot compared with new." },
      { q: "Which iPhone is the oldest worth buying in 2026?", a: "We recommend the iPhone 11 or newer so you keep getting updates and app support." },
    ],
  },
  {
    ...buying,
    id: "j-before-buying-ipad",
    slug: "things-to-know-before-buying-an-ipad",
    title:
      "What to Know Before Buying an iPad in Kenya: Which iPad Model, Wi-Fi or Cellular, Storage, Apple Pencil and Keyboard Compatibility, and What to Check on a Second-Hand iPad",
    seoTitle:
      "What to Know Before Buying an iPad | What to Check Before Buying an iPad Second Hand | Wi-Fi vs Cellular, Storage, Apple Pencil | Gadget Hub Kenya",
    excerpt:
      "Before you buy an iPad: which model fits you, Wi-Fi or Cellular, how much storage, which Apple Pencil and keyboard work with it, and what to check on a used iPad.",
    seoDescription:
      "What to know before buying an iPad in Kenya: iPad vs iPad Air vs iPad Pro vs mini, Wi-Fi or Cellular, storage, Apple Pencil compatibility and second-hand checks. Live iPad prices at Gadget Hub Nairobi.",
    tags: ["what to know before buying an iPad", "what to check before buying an iPad", "iPad Wi-Fi or Cellular", "iPad second hand Kenya", "which iPad to buy"],
    coverAlt: "Choosing an iPad",
    paragraphs: [
      "“What to know before buying an iPad” and “what to check when buying an iPad second hand” are the questions behind most iPad purchases. Here is the checklist.",
      "## 1. Pick the right model",
      "[iPad (A16)](/ipad/ipad-a16) from {{price:ipad-a16}} for study, video calls and streaming. [iPad Air](/ipad/ipad-air-11-m4) from {{price:ipad-air-11-m4}} for heavier note-taking and multitasking. [iPad Pro](/ipad/ipad-pro-11-m5) from {{price:ipad-pro-11-m5}} for drawing, design and video. [iPad mini](/ipad/ipad-mini-a17-pro) from {{price:ipad-mini-a17-pro}} for reading and portability. Students: see [the best iPad for students](/journal/best-ipad-for-students-in-kenya).",
      "## 2. Wi-Fi or Cellular",
      "Wi-Fi models are cheaper and enough for home, school and office. Cellular models take a SIM or eSIM so the iPad has data anywhere — worth it if you travel or study away from Wi-Fi. You can also hotspot from your phone.",
      "## 3. Storage",
      "Storage can't be added later. 128GB suits most people; choose 256GB or more for downloaded films, large textbooks, drawings or video projects.",
      "## 4. Apple Pencil and keyboard compatibility",
      "Not every Pencil works with every iPad. The iPad (A16) uses the Apple Pencil (USB-C); recent iPad Air, iPad Pro and iPad mini models work with the Apple Pencil Pro. Keyboards are model-specific too. Check on the [Apple Pencil](/accessories/apple-pencil) and [Magic Keyboard](/accessories/magic-keyboard) pages before you buy.",
      "## 5. Checks for second-hand and Ex-UK iPads",
      "Make sure the previous owner's Apple Account is signed out and Find My is off, test the screen for dead spots, check the charging port and speakers, and confirm the serial on Apple's Check Coverage site. Ex-UK iPads at Gadget Hub come with condition stated on the invoice — for example the [iPad (10th gen)](/ipad/ipad-10) Ex-UK from {{exuk:ipad-10}}.",
      ...served("Try every iPad, Pencil and keyboard combination in the shop before you choose."),
    ],
    faq: [
      { q: "What should I check before buying an iPad?", a: "The right model for your use, Wi-Fi or Cellular, enough storage, and that your chosen Apple Pencil and keyboard are compatible." },
      { q: "What should I check on a second-hand iPad?", a: "Apple Account signed out and Find My off, screen and charging port working, and the serial number on Apple's Check Coverage site." },
      { q: "Do I need a Cellular iPad?", a: "Only if you need data away from Wi-Fi. Most people choose Wi-Fi and hotspot from their phone." },
      { q: "Which Apple Pencil works with my iPad?", a: "It depends on the model — check the compatibility list on the Apple Pencil page before buying." },
    ],
  },
  {
    ...buying,
    id: "j-before-buying-macbook",
    slug: "things-to-know-before-buying-a-macbook",
    title:
      "What to Know Before Buying a MacBook in Kenya: Air vs Pro, Memory and Storage, Screen Size, Software You Need, and What to Check Before Buying a Used MacBook",
    seoTitle:
      "What to Know Before Buying a MacBook | What to Check Before Buying a Used MacBook Pro or Air | Memory, Storage, Air vs Pro | Gadget Hub Kenya",
    excerpt:
      "Before you buy a MacBook: Air or Pro, how much memory and storage, 13 or 15 inches, whether your software runs on Mac, and the checks for a used MacBook.",
    seoDescription:
      "What to know before buying a MacBook in Kenya: Air vs Pro, 16GB memory, storage, screen size, Mac software and what to check on a used MacBook (battery cycles, activation lock). Live MacBook prices.",
    tags: ["what to know before buying a MacBook", "what to check before buying a used MacBook", "MacBook Air vs Pro", "MacBook memory storage", "buying MacBook Kenya"],
    coverAlt: "Choosing a MacBook",
    paragraphs: [
      "“What to know before buying a MacBook” and “what to check before buying a used MacBook Pro” are searched by students and professionals about to spend a lot of money. Here is the short version of our counter advice.",
      "## 1. Air or Pro",
      "The MacBook Air is silent, light and enough for study, office work, coding and light editing — the [MacBook Air 13-inch M4](/mac/macbook-air-13-m4) starts at {{price:macbook-air-13-m4}}. The MacBook Pro has a fan for sustained performance, a brighter screen and more ports, for video editing, music production and heavy development — the [MacBook Pro 14-inch M5](/mac/macbook-pro-14-m5) starts at {{price:macbook-pro-14-m5}}.",
      "## 2. Memory and storage can't be upgraded",
      "Memory (RAM) and storage are fixed when you buy. 16GB of memory is the sensible minimum today; 24GB or more for heavy editing. 256GB of storage works if you use cloud storage; 512GB or more if you keep photos, video or big projects on the laptop.",
      "## 3. 13 or 15 inches",
      "13-inch is easier to carry to class and on matatus; 15-inch gives more room for spreadsheets and editing. Try both in the shop.",
      "## 4. Check your software runs on Mac",
      "Microsoft Office, Chrome, Zoom, Adobe apps and most coding tools run on Mac. Some Windows-only engineering, accounting or school software doesn't — check with your school or employer first.",
      "## 5. Checks for a used or Ex-UK MacBook",
      "Make sure Activation Lock is off (the previous owner signed out of Find My), check battery cycle count and condition in System Settings › Battery, test the keyboard, trackpad, ports, speakers and camera, and confirm the serial on Apple's Check Coverage site. Ex-UK MacBooks at Gadget Hub state the condition on the invoice — the [MacBook Air M1](/mac/macbook-air-13-m1) Ex-UK starts at {{exuk:macbook-air-13-m1}}.",
      "## Which one to buy",
      "See [the best MacBook to buy in Kenya](/journal/best-macbook-to-buy-in-kenya), and once you've bought it, [what you need to set up a new MacBook](/journal/what-you-need-to-set-up-a-new-macbook).",
      ...served("Compare MacBook Air and Pro side by side in the shop, and we'll check software compatibility for your course or job."),
    ],
    faq: [
      { q: "What should I know before buying a MacBook?", a: "Choose Air or Pro for your workload, buy at least 16GB of memory, pick enough storage (it can't be upgraded), and check your software runs on Mac." },
      { q: "What should I check before buying a used MacBook?", a: "Activation Lock off, battery cycle count, keyboard, trackpad and ports working, and the serial on Apple's Check Coverage site." },
      { q: "Is 8GB of RAM enough on a MacBook?", a: "It works for light use, but 16GB is the better choice today and is standard on current MacBook Air models." },
      { q: "Can I run Windows software on a MacBook?", a: "Most popular apps have Mac versions. Some Windows-only programs don't run — check before you buy." },
    ],
  },
  {
    ...buying,
    id: "j-what-you-need-to-own-iphone",
    slug: "what-you-need-when-you-get-an-iphone",
    title:
      "What You Need When You Get an iPhone: Apple Account, iCloud Storage, USB-C Charger, Case and Screen Protector, and the First Apps to Install in Kenya",
    seoTitle:
      "What Do You Need to Have an iPhone? Apple Account, iCloud, Charger, Case & Screen Protection | First iPhone Checklist Kenya | Gadget Hub",
    excerpt:
      "First iPhone? Everything you need to own one in Kenya: an Apple Account, iCloud storage, the right charger, a case, and the first apps to install — M-PESA, banking and WhatsApp.",
    seoDescription:
      "What you need to have an iPhone in Kenya: an Apple Account, iCloud storage, a USB-C power adapter (not in the box), a case and screen protection, plus M-PESA, bank and WhatsApp apps. First-iPhone checklist.",
    tags: ["what do you need to have an iPhone", "first iPhone Kenya", "iPhone charger not in box", "iPhone accessories Kenya", "apps for new iPhone Kenya"],
    coverAlt: "A new iPhone with accessories",
    paragraphs: [
      "Buying your first iPhone, or buying one for a parent or teenager? People ask “what do you need to have an iPhone?” because Apple puts very little in the box. Here is the full list.",
      "## An Apple Account",
      "The account behind your apps, iCloud and Find My. Create one with an email you'll keep for years — see [creating an Apple Account in Kenya](/journal/create-apple-id-apple-account-kenya).",
      "## A charger",
      "New iPhones come with a USB-C cable but no power adapter. Use a genuine Apple adapter of 20W or more, such as the [Apple 20W USB-C Power Adapter](/accessories/power-adapter-20w) at {{price:power-adapter-20w}}. Cheap street chargers are a common reason iPhones charge slowly or get damaged.",
      "## A case and screen protection",
      "A drop on Nairobi pavements can crack the back or screen. A fitted case such as an [Apple Silicone or Clear case](/accessories/cases) for your exact model, plus a screen protector, costs far less than a repair.",
      "## iCloud storage",
      "Apple gives 5GB of free iCloud storage, which fills quickly once photos and backups pile up. Many people add an iCloud+ plan so their photos and WhatsApp are always backed up.",
      "## The first apps to install",
      "WhatsApp, M-PESA (or use the SIM menu), your bank's app, Google Maps or Apple Maps, your email app, and Uber or Bolt. Turn on Find My and iCloud Backup in Settings on day one.",
      "## Optional extras",
      "[AirPods](/airpods) for calls and music, an [Apple Watch](/watch) for fitness and notifications, and a [MagSafe charger](/accessories/magsafe-charger-1m) for easy wireless charging.",
      ...served("We'll set up your first iPhone, fit a case and protector, and install your M-PESA and banking apps before you leave."),
    ],
    faq: [
      { q: "What do you need to have an iPhone?", a: "An Apple Account, a USB-C power adapter (not in the box), and ideally a case, screen protector and some iCloud storage." },
      { q: "Does a new iPhone come with a charger?", a: "It comes with a USB-C cable but not a power adapter. Use a genuine 20W or higher USB-C adapter." },
      { q: "Does M-Pesa work on iPhone?", a: "Yes. Use the SIM menu or download the M-PESA app from the App Store." },
      { q: "How much iCloud storage do I need?", a: "The free 5GB fills quickly; most people with many photos add a paid iCloud+ plan." },
    ],
  },
  {
    ...buying,
    id: "j-apple-store-kenya",
    slug: "apple-store-kenya-where-to-buy-apple-products",
    title:
      "Apple Store in Kenya: Is There an Official Apple Store in Nairobi? Where to Buy Genuine Apple Products, Apple Authorised Resellers, Prices and Warranty",
    seoTitle:
      "Apple Store Kenya | Is There an Apple Store in Nairobi? Apple Store Kenya Location & Prices | Buy Genuine Apple Products at Gadget Hub",
    excerpt:
      "People search “Apple Store Kenya location” — but there is no Apple-owned store in Kenya. Here is where to buy genuine Apple products in Nairobi instead, with prices and warranty.",
    seoDescription:
      "Is there an Apple Store in Kenya? Apple has no company-owned store in Kenya; buy from an Apple Authorised Reseller. Gadget Hub, Norwich Union House opposite Hilton, Nairobi CBD — iPhone, MacBook, iPad prices.",
    tags: ["Apple Store Kenya", "Apple Store Nairobi", "Apple Store Kenya location", "Apple Store Kenya prices", "Apple Authorised Reseller Kenya"],
    coverAlt: "Buying Apple products in Nairobi",
    paragraphs: [
      "“Apple Store Kenya”, “Apple Store Nairobi location” and “Apple Store Kenya prices” are searched every day. The honest answer: Apple does not run its own retail store in Kenya. So where do you buy a genuine iPhone, MacBook or iPad, with a warranty?",
      "## Buy from an Apple Authorised Reseller",
      "Apple sells through authorised resellers in markets without an Apple Store. An authorised reseller sells genuine Apple products, with official stock and a proper invoice. Gadget Hub is an Apple Authorised Reseller in Nairobi CBD.",
      "## What you can buy",
      "Every current [iPhone](/iphone) — [iPhone 18 Pro Max](/iphone/iphone-18-pro-max) from {{price:iphone-18-pro-max}}, [iPhone 17](/iphone/iphone-17) from {{price:iphone-17}} — plus [MacBook](/mac), [iPad](/ipad), [Apple Watch](/watch), [AirPods](/airpods), [Apple TV and HomePod](/tv-home) and genuine [accessories](/accessories). New with a 1-year warranty, or Ex-UK with the condition on your invoice.",
      "## Prices",
      "Prices in Kenya include import costs and VAT, so they differ from US prices on apple.com. Gadget Hub publishes live prices on every product page, so you can compare before you visit.",
      "## Avoid fakes",
      "Look for a physical shop, business payment and an invoice with the serial number. See [how to tell an original iPhone](/journal/how-to-tell-original-iphone-kenya) and [original vs fake AirPods](/journal/original-vs-fake-airpods-kenya).",
      ...served("Visit to see and test Apple products, get them set up, trade in your old device or start Lipa Mdogo Mdogo."),
    ],
    faq: [
      { q: "Is there an Apple Store in Kenya?", a: "Apple does not run its own retail store in Kenya. Genuine Apple products are sold by Apple Authorised Resellers such as Gadget Hub." },
      { q: "Where can I buy genuine Apple products in Nairobi?", a: "Gadget Hub, an Apple Authorised Reseller at Norwich Union House, opposite the Hilton Hotel, 4th Floor, Suite 15, Nairobi CBD." },
      { q: "Why are Apple prices in Kenya higher than in the US?", a: "Kenyan prices include import costs and VAT; US prices on apple.com usually exclude sales tax." },
      { q: "Do Apple products in Kenya have a warranty?", a: "New devices from Gadget Hub come with a 1-year warranty and an invoice." },
    ],
  },
];
