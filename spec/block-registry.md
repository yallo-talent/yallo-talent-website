# The block registry, and the seam the content engine grows on

**Round 26, A2A. Written so a future round starts from here rather than from
the code.**

## Why this note exists

Sumeet's roadmap for the talent business is a Bloomberg-class content engine:
audio and podcasts, Yallo's own video, reshared YouTube video, images,
carousels. Round 26 did **not** build audio or video hosting, and R-26.5 scopes
that out by name — hosting is transcoding and storage infrastructure and it does
not fit in one night. What round 26 did build is the seam that makes each of
those an **additive** block type: a new node, a new renderer entry, and no
migration of any stored body.

This note records that seam, because a property nobody has written down is a
property the next round has to rediscover by reading five files.

## The four places a block type exists

A block is exactly four declarations. There is no fifth, and nothing else in the
estate needs to know a new one has arrived.

| # | File | What goes in it |
|---|------|-----------------|
| 1 | `src/lib/tiptap/schema.mjs` | The type name, in `BLOCK_NODES`. This is the allow-list the publish rules, the importer and the renderer all read. |
| 2 | `src/lib/tiptap/blocks.ts` | The attribute interface, plus any parsing or resolution the attributes need. Imported by both the node view that writes them and the renderer that draws them. |
| 3 | `src/components/blocks/editorial/TiptapBody.tsx` | One `case` in `renderBlock`, and its CSS in `YalloBlocks.module.css`. |
| 4 | `src/components/admin/editor/YalloNodes.tsx` and `block-inserts.ts` | The TipTap node with its editing view, and one row in the registry. |

Also touch `src/lib/tiptap/text.mjs` if the block carries no prose: add it to the
no-op arm of `docToText`, so it contributes nothing to the word count and the
reading time. That contract was set in round 25 and every publish rule that
reads prose depends on it.

## Why this is additive rather than a migration

A stored body is a TipTap document: an ordered tree of typed nodes. A document
that does not carry the new node type is unaffected by that type existing —
there is no schema version on the column, no shape the parser has to be told
about, and no default to backfill. So a new block is only ever a widening of
what a body **may** contain, never a change to what any body **does** contain.

Two consequences worth stating plainly:

- **Nothing needs to be rewritten when a block is added.** Not the twenty-one
  articles, not the nine studies, not the revision history.
- **Nothing breaks when a block is removed either**, as long as the removal takes
  the renderer case with it: `renderBlock` has no default branch, so an unknown
  node draws nothing, and `disallowedNodes` produces a finding naming the type.
  A body carrying a retired block degrades to a gap with a warning, not to a
  crash.

## The two surfaces that must not drift

`block-inserts.ts` is the **only** list of what can be inserted. The persistent
toolbar's Blocks menu and the slash menu both project from it; before round 26
the slash menu held its own copy and the toolbar did not exist. Two copies of
this list is a block that is reachable one way and not the other, which is the
defect the file's own header warns about.

`inBlocksMenu` narrows the **toolbar's** menu only. Headings, lists and quotes
have their own controls on the toolbar, so repeating them inside the menu would
be the same command twice a centimetre apart. The slash menu always offers
everything, because somebody typing `/head` is not looking at the toolbar.

## What round 26 added, as the worked example

**YouTube**, the first embed node.

- Stored as the eleven-character video id, never a URL and never markup. The
  field accepts a watch link, a share link, a Shorts link or a bare id, because
  a URL is what a person has to hand; `youtubeId()` reduces it on the way in.
- The address is **composed** by the renderer from the id, so there is no value
  an author can type that produces a frame pointing anywhere but YouTube's
  privacy-enhanced host. This is what makes an embed compatible with an
  allow-list renderer at all: the renderer never has to trust what it was given.
- `youtube-nocookie.com`, so no tracking cookie is set until a visitor presses
  play. `rel=0`, so the end-of-video suggestions stay on the same channel rather
  than offering a reader somebody else's content on a Yallo Talent page.
- `loading="lazy"`, inside a container holding a 16:9 aspect ratio, so a
  third-party document near the foot of a long article neither spends a reader's
  connection nor moves the text under their eyes when it arrives.
- The caption is the text alternative and the frame's accessible name. Rule 7
  covers it — the same rule as an image's alt text, deliberately, because "media
  with nothing readable beside it" is one fault and a per-type rule is a rule
  somebody forgets to write for the fourth type. `embeds()` in `text.mjs` is the
  traversal, and `EMBED_NODES` is the list it walks.

The preview inside the editor is a **thumbnail, not a player**. A live embed
inside a contenteditable is a document that steals the caret and plays audio at
whoever is writing; the thumbnail answers the only question the writer is asking
there, which is whether the id resolves to the right video.

## What is deliberately not built

- **Audio and native video hosting.** R-26.5 scopes it out by name. Both need
  transcoding, storage and a player, and the storage half already exists in
  `src/lib/media/` — the missing pieces are the transcoding pipeline and the
  rendition policy for time-based media, neither of which is a block-type
  problem.
- **A carousel.** Named as round 26's stretch item (§4a) and not reached. It is
  the cheapest proof of this seam, because it needs no new infrastructure at
  all: an array of media-library ids in the attributes, a renderer that draws
  them, and the four steps above.
