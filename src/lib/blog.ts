/** @deprecated Prefer `src/lib/journal.ts` - Blog is now Journal. */
export {
  type JournalPost as BlogPost,
  journalSeedPosts as blogPosts,
  getPost,
  latestPosts,
  listPublishedJournalPosts,
  getPublishedJournalPost,
  latestJournalPosts,
} from "./journal";
