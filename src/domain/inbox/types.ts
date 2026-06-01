import type { InboxClassificationOutput } from "@/ai/schemas";

export type InboxItemStatus = "captured" | "triaged" | "converted" | "discarded" | "archived";
export type InboxContentType = "text" | "voice_note" | "image_placeholder" | "file" | "link";

export type InboxDestinationType =
  | "task"
  | "project"
  | "calendar_event"
  | "habit"
  | "reference"
  | "future_idea"
  | "discard"
  | "needs_clarification";

export type InboxItem = {
  id: string;
  content: string;
  contentType: InboxContentType;
  status: InboxItemStatus;
  classification?: InboxClassificationOutput;
  destinationType?: InboxDestinationType;
  destinationId?: string;
  processingNote?: string;
  createdAt: string;
};

export type ProcessInboxItemInput = {
  destinationType: InboxDestinationType;
  destinationId?: string;
  note?: string;
};
