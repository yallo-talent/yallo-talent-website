"use client";

import { useState } from "react";
import styles from "@/app/admin/Admin.module.css";

/**
 * Drag and drop for the case-study order — design §8, "ordering is drag and
 * drop, with an integer position column and one save".
 *
 * IT DOES NOT REPLACE THE MOVE BUTTONS, and that is deliberate rather than a
 * hedge. HTML5 drag and drop is mouse-only: there is no keyboard equivalent
 * and no touch support, so a surface where dragging is the only way to reorder
 * is a surface a keyboard user cannot reorder at all. The per-row Move up and
 * Move down buttons stay as the accessible path and this sits over them, which
 * is the arrangement SC 2.1.1 actually asks for — not a drag handle with an
 * `aria-label` on it.
 *
 * NOTHING IS WRITTEN UNTIL THE ORDER IS SAVED. A drop rearranges this list and
 * shows that there is an unsaved change; the transaction happens on submit.
 * Writing on every drop would be nine transactions for one reordering and would
 * leave the rail in an order nobody chose if a drag were interrupted halfway.
 *
 * THE SUBMITTED VALUE IS THE WHOLE SEQUENCE, one hidden field, which is exactly
 * what `reorderCaseStudies` takes.
 */
export interface OrderRow {
  slug: string;
  title: string;
  status: string;
}

export function OrderList({
  rows,
  reorderAction,
}: {
  rows: OrderRow[];
  reorderAction: (formData: FormData) => Promise<void>;
}) {
  const [order, setOrder] = useState<OrderRow[]>(rows);
  const [dragging, setDragging] = useState<string | null>(null);
  const dirty = order.some((row, i) => row.slug !== rows[i]?.slug);

  function move(from: number, to: number) {
    if (from === to || to < 0 || to >= order.length) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next);
  }

  return (
    <form action={reorderAction}>
      <input
        name="order"
        type="hidden"
        value={order.map((r) => r.slug).join(",")}
      />
      <ol className={styles.rows}>
        {order.map((row, i) => (
          <li
            className={styles.row}
            data-dragging={dragging === row.slug ? "true" : undefined}
            draggable
            key={row.slug}
            onDragEnd={() => setDragging(null)}
            onDragOver={(event) => {
              /* Without this the drop never fires: the default handling of
                 dragover is to refuse the drop. */
              event.preventDefault();
              if (dragging === null || dragging === row.slug) return;
              move(
                order.findIndex((r) => r.slug === dragging),
                i,
              );
            }}
            onDragStart={() => setDragging(row.slug)}
          >
            <div className={styles.rowHead}>
              <span className={styles.meta}>{i + 1}</span>
              <span className={styles.rowTitle}>{row.title}</span>
              <span className={styles.meta}>{row.status}</span>
            </div>
          </li>
        ))}
      </ol>
      <button className={styles.submit} disabled={!dirty} type="submit">
        {dirty ? "Save this order" : "Order unchanged"}
      </button>
      <p aria-live="polite" className={styles.note}>
        {dirty
          ? "Unsaved. The order below is not live until it is saved."
          : "Drag a study to move it, or use the Move up and Move down buttons on each row. Both write the same single transaction."}
      </p>
    </form>
  );
}
