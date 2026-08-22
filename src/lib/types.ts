export type ProviderSlug =
  | "openai"
  | "anthropic"
  | "google"
  | "meta"
  | "xai"
  | "deepseek"
  | "mistral"
  | "qwen"
  | "moonshot"
  | "zai"
  | "cursor";

export type EventType =
  | "new_model"
  | "deprecation_notice"
  | "alias_retirement"
  | "price_change"
  | "context_change"
  | "breaking_behavior"
  | "rate_limit"
  | "sunset";

export type Severity = "low" | "medium" | "high";

export interface Provider {
  slug: ProviderSlug;
  name: string;
  color: string;
  homepage: string;
}

export interface Source {
  id: string;
  provider: ProviderSlug;
  label: string;
  url: string;
  kind: "changelog" | "release_notes" | "docs" | "blog";
  check_interval_hours: number;
}

export interface Model {
  id: string;
  provider: ProviderSlug;
  name: string;
  family?: string;
  release_date: string; // ISO
  context_window?: number;
  max_output?: number;
  pricing_input?: number; // per 1M
  pricing_output?: number;
  pricing_reasoning?: number;
  open_weights: boolean;
  type: "general" | "reasoning" | "code" | "multimodal";
  source_url: string;
  status: "ga" | "preview" | "deprecated" | "retired";
}

export interface ModelEvent {
  id: string;
  provider: ProviderSlug;
  model_id?: string;
  model_name: string;
  event_type: EventType;
  severity: Severity;
  title: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  source_url: string;
  detected_at: string;
  effective_date?: string;
  why_it_matters: string;
  fix: string;
}

export interface Subscriber {
  email: string;
  providers: ProviderSlug[]; // empty = all
  severities: Severity[];
  channel: "email" | "discord" | "telegram";
  webhook_url?: string;
  created_at: string;
}

export interface PricePoint {
  date: string;
  input: number;
  output: number;
}
