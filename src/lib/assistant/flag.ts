/**
 * The assistant's kill switch. **On by default**, per Sumeet's ruling R-A1
 * (context-round16-scope.md §1): the assistant ships on and stays available,
 * reversing the ships-dark position of context-round13-chatbot.md §3.
 *
 * The committed default is the shipped default, so there is one build shape
 * and no configuration in which a local server differs from production.
 *
 * The comparison is inverted rather than flipped: only the exact string
 * "false" disables. src/config/theme.ts tests against the non-default value
 * for the same reason — an unset, empty or misspelled env var must land on the
 * default, and the default is now on. `NEXT_PUBLIC_ASSISTANT_ENABLED=false`
 * remains a real kill switch for a build that needs one.
 */
export const ASSISTANT_ENABLED: boolean =
  process.env.NEXT_PUBLIC_ASSISTANT_ENABLED !== "false";
