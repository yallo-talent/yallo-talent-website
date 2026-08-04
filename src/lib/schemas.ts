import { z } from "zod";

export const briefFormSchema = z.object({
  name: z.string().min(2, "Please share your name."),
  company: z.string().min(2, "Please share your company."),
  email: z.string().email("Please share a valid email."),
  role: z.string().min(2, "What role or roles are you hiring for?"),
  platform: z.string().optional(),
  region: z.enum(["uk", "me", "india", "multi"], {
    message: "Pick a delivery region.",
  }),
  engagement: z.enum(["contract", "permanent", "eor", "managed-delivery"], {
    message: "Pick an engagement type.",
  }),
  message: z
    .string()
    .min(10, "Give us a couple of sentences of context.")
    .max(4000, "Keep it under 4,000 characters — the rest is easy on a call."),
  // One brief shape, two surfaces. `source` tells the capture layer which
  // produced the payload; `transcriptId` names the assistant conversation
  // it was assembled from and is absent for a directly-submitted form.
  // Named to match assistantBriefPayloadSchema's field exactly
  // (src/lib/assistant/schema.ts) rather than the other way round — that
  // side was already built and tested against `transcriptId` before this
  // extension landed.
  source: z.enum(["form", "assistant"]).default("form"),
  transcriptId: z.string().optional(),
});

export type BriefFormValues = z.infer<typeof briefFormSchema>;

export const cvUploadSchema = z.object({
  name: z.string().min(2, "Please share your name."),
  email: z.string().email("Please share a valid email."),
  linkedin: z.string().url().optional().or(z.literal("")),
  interests: z.array(z.string()).min(1, "Pick at least one area."),
  message: z.string().max(1000).optional(),
  // Filename + size sent; the file body is separate multipart in a real flow.
  filename: z.string().min(1, "Attach a CV file."),
});

export type CvUploadValues = z.infer<typeof cvUploadSchema>;
