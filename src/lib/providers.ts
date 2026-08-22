import { Provider, ProviderSlug, Source } from "./types";

export const PROVIDERS: Record<ProviderSlug, Provider> = {
  openai: { slug: "openai", name: "OpenAI", color: "#74aa9c", homepage: "https://openai.com" },
  anthropic: { slug: "anthropic", name: "Anthropic", color: "#d4a27f", homepage: "https://anthropic.com" },
  google: { slug: "google", name: "Google", color: "#4285f4", homepage: "https://deepmind.google" },
  meta: { slug: "meta", name: "Meta", color: "#0668e1", homepage: "https://ai.meta.com" },
  xai: { slug: "xai", name: "xAI", color: "#111", homepage: "https://x.ai" },
  deepseek: { slug: "deepseek", name: "DeepSeek", color: "#4d6bfe", homepage: "https://deepseek.com" },
  mistral: { slug: "mistral", name: "Mistral", color: "#ff7000", homepage: "https://mistral.ai" },
  qwen: { slug: "qwen", name: "Qwen", color: "#7c3aed", homepage: "https://qwen.ai" },
  moonshot: { slug: "moonshot", name: "Moonshot AI", color: "#0ea5e9", homepage: "https://moonshot.ai" },
  zai: { slug: "zai", name: "Z.ai", color: "#0f172a", homepage: "https://z.ai" },
  cursor: { slug: "cursor", name: "Cursor", color: "#000", homepage: "https://cursor.com" },
};

export const SOURCES: Source[] = [
  // OpenAI - treat changelog as primary, blog as secondary
  { id: "openai-changelog", provider: "openai", label: "OpenAI Changelog", url: "https://platform.openai.com/docs/changelog", kind: "changelog", check_interval_hours: 4 },
  { id: "openai-release", provider: "openai", label: "OpenAI News", url: "https://openai.com/news", kind: "blog", check_interval_hours: 6 },
  // Anthropic
  { id: "anthropic-release", provider: "anthropic", label: "Anthropic News", url: "https://www.anthropic.com/news", kind: "blog", check_interval_hours: 4 },
  { id: "anthropic-docs", provider: "anthropic", label: "Anthropic Docs - Models", url: "https://docs.anthropic.com/en/docs/about-claude/models", kind: "docs", check_interval_hours: 4 },
  // Google
  { id: "google-changelog", provider: "google", label: "Gemini API Changelog", url: "https://ai.google.dev/gemini-api/docs/changelog", kind: "changelog", check_interval_hours: 4 },
  { id: "google-blog", provider: "google", label: "Google DeepMind Blog", url: "https://deepmind.google/blog/", kind: "blog", check_interval_hours: 6 },
  // Meta
  { id: "meta-llama", provider: "meta", label: "Meta Llama / Muse Spark", url: "https://ai.meta.com/blog/", kind: "blog", check_interval_hours: 6 },
  // xAI
  { id: "xai-news", provider: "xai", label: "xAI News", url: "https://x.ai/news", kind: "blog", check_interval_hours: 6 },
  { id: "xai-docs", provider: "xai", label: "xAI Docs", url: "https://docs.x.ai", kind: "docs", check_interval_hours: 6 },
  // DeepSeek
  { id: "deepseek-api", provider: "deepseek", label: "DeepSeek API Docs", url: "https://api-docs.deepseek.com", kind: "docs", check_interval_hours: 4 },
  // Mistral
  { id: "mistral-news", provider: "mistral", label: "Mistral News", url: "https://mistral.ai/news", kind: "blog", check_interval_hours: 6 },
  { id: "mistral-docs", provider: "mistral", label: "Mistral Models", url: "https://docs.mistral.ai/getting-started/models", kind: "docs", check_interval_hours: 6 },
  // Qwen
  { id: "qwen-news", provider: "qwen", label: "Qwen News", url: "https://qwen.ai/blog", kind: "blog", check_interval_hours: 6 },
  // Moonshot
  { id: "moonshot-news", provider: "moonshot", label: "Moonshot News", url: "https://platform.moonshot.ai/docs", kind: "docs", check_interval_hours: 6 },
  // Z.ai
  { id: "zai-news", provider: "zai", label: "Z.ai News", url: "https://z.ai/blog", kind: "blog", check_interval_hours: 6 },
  // Cursor
  { id: "cursor-changelog", provider: "cursor", label: "Cursor Changelog", url: "https://cursor.com/changelog", kind: "changelog", check_interval_hours: 6 },
];

export const PROVIDER_LIST = Object.values(PROVIDERS);
