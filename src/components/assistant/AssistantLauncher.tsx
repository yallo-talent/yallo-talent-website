"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ASSISTANT_ENABLED } from "@/lib/assistant/flag";
import styles from "./AssistantLauncher.module.css";
import { AssistantPanel } from "./AssistantPanel";

/**
 * The deferred island's mount point. Flag off by default (context-round13-
 * chatbot.md §3: "ships dark") — the check happens here too, in addition to
 * wherever this is dynamically imported from, so this component is safe to
 * mount directly during development or review before that import lands.
 *
 * Both a named and a default export: the seam this composes against
 * (context-round13-scope.md §3.2 item 2) is A's to write, and its exact
 * import shape had not landed as of this session, so both forms are offered
 * rather than guessed at.
 */
export function AssistantLauncher() {
  const [open, setOpen] = useState(false);

  if (!ASSISTANT_ENABLED) return null;

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="assistant-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" className={styles.icon}>
          {open ? "×" : "?"}
        </span>
        <span className={styles.label}>
          {open ? "Close assistant" : "Ask Yallo Talent"}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="assistant-panel-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <AssistantPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AssistantLauncher;
