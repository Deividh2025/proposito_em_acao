# DeepSeek-Only AI Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the entire AI layer under DeepSeek V4 Pro, ensuring all runtime invocations use DeepSeek and removing OpenAI/GPT options from the UI.

**Architecture:** Modify the AI router to always resolve the provider as `"deepseek"`. Update the UI to hide OpenAI options and consent. Update environment defaults and unit tests to align with this single-provider model.

**Tech Stack:** Next.js App Router, React, TypeScript, Zod, Vitest.

## Global Constraints
- Do not remove the physical files `src/lib/openai/client.ts` and `src/lib/openai/provider.ts` to ensure compilation and imports across the codebase remain valid.
- Technical DB and consent identifier `ai_provider_openai_v1` is maintained for compatibility but hidden from the UI.
- All code changes must pass the local TypeScript typecheck and Vitest suites.

---

### Task 1: Update AI Config Defaults

**Files:**
- Modify: `src/lib/config/env.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: None
- Produces: Updated defaults for environment variables

- [ ] **Step 1: Write a failing test or verify current defaults**
  Ensure we have tests checking environment defaults or check config directly.
  Let's open `src/lib/config/env.ts` and update the defaults.

- [ ] **Step 2: Update default models in env schema**
  Modify `src/lib/config/env.ts` to set the defaults for `DEEPSEEK_MODEL_FLASH` and `DEEPSEEK_MODEL_PRO` to `"deepseek-ai/deepseek-v4-pro"`.
  ```typescript
  DEEPSEEK_MODEL_FLASH: optionalStringEnvSchema.default("deepseek-ai/deepseek-v4-pro"),
  DEEPSEEK_MODEL_PRO: optionalStringEnvSchema.default("deepseek-ai/deepseek-v4-pro"),
  ```

- [ ] **Step 3: Update `.env.example`**
  Update `.env.example` to remove the default OpenAI gpt placeholders and explain that the default is Nvidia's DeepSeek V4 Pro.

- [ ] **Step 4: Run typecheck to verify**
  Run: `npm.cmd run typecheck`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run:
  ```bash
  git add src/lib/config/env.ts .env.example
  git commit -m "chore: update environment default models for deepseek unification"
  ```

---

### Task 2: Lock AI Router to DeepSeek

**Files:**
- Modify: `src/lib/ai/routing.ts`
- Test: `src/tests/unit/ai-provider-routing.test.ts`

**Interfaces:**
- Consumes: `resolveConcreteProvider` from `routing.ts`
- Produces: Provider resolution locked to `"deepseek"`

- [ ] **Step 1: Write the failing tests in `ai-provider-routing.test.ts`**
  We will modify the tests in `src/tests/unit/ai-provider-routing.test.ts` to assert that all agent keys and preferences route to `"deepseek"`.
  Change lines 98-99:
  ```typescript
  expect(sensitive).toMatchObject({ providerName: "deepseek", mode: "real", model: "deepseek-reasoner" });
  expect(operational).toMatchObject({ providerName: "deepseek", mode: "real", model: "deepseek-chat" });
  ```
  Change lines 118-123:
  ```typescript
  expect(openaiRoute).toMatchObject({
    requestedPreference: "openai",
    providerName: "deepseek",
    mode: "real",
    model: "deepseek-chat"
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/tests/unit/ai-provider-routing.test.ts`
  Expected: FAIL (on sensitivity checks routing to `"openai"`)

- [ ] **Step 3: Write minimal implementation in `routing.ts`**
  Modify `resolveConcreteProvider` in `src/lib/ai/routing.ts` to always return `"deepseek"`:
  ```typescript
  function resolveConcreteProvider(agentKey: AiAgentKey, preference: AiProviderPreference): RealAiProviderName {
    return "deepseek";
  }
  ```

- [ ] **Step 4: Run tests to verify they pass**
  Run: `npx vitest run src/tests/unit/ai-provider-routing.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run:
  ```bash
  git add src/lib/ai/routing.ts src/tests/unit/ai-provider-routing.test.ts
  git commit -m "feat: lock AI provider routing to deepseek"
  ```

---

### Task 3: Simplify Settings UI

**Files:**
- Modify: `src/components/settings/SettingsCenter.tsx`
- Modify: `src/domain/privacy/index.ts`

**Interfaces:**
- Consumes: settings snapshot and consent definitions
- Produces: UI with OpenAI options hidden

- [ ] **Step 1: Modify `src/domain/privacy/index.ts`**
  Keep the technical definition of `ai_provider_openai` but we can change the label to `"Nvidia Nemotron (Vision)"` if needed, or simply let the UI hide it.

- [ ] **Step 2: Modify `src/components/settings/SettingsCenter.tsx`**
  - In `providerOptions`, remove the `openai` option:
    ```typescript
    const providerOptions = [
      {
        label: "Automatico (DeepSeek V4 Pro)",
        value: "automatic",
        description: "Usa o modelo DeepSeek V4 Pro na Nvidia Integrate API para todos os fluxos."
      },
      {
        label: "DeepSeek V4 Pro",
        value: "deepseek",
        description: "Preferencia explicita para usar o modelo DeepSeek V4 Pro."
      }
    ] as const;
    ```
  - In the consents mapping in the JSX (around line 395), filter out `openai` so it doesn't render:
    ```typescript
    {(Object.keys(providerConsentMap) as ConsentProvider[])
      .filter((provider) => provider !== "openai")
      .map((provider) => { ... })
    }
    ```

- [ ] **Step 3: Run typecheck and lint**
  Run: `npm.cmd run typecheck` and `npm.cmd run lint`
  Expected: PASS

- [ ] **Step 4: Commit**
  Run:
  ```bash
  git add src/components/settings/SettingsCenter.tsx src/domain/privacy/index.ts
  git commit -m "ui: hide openai provider preference and consent options from settings"
  ```

---

### Task 4: Complete System Validation

**Files:**
- Modify: `docs/ENVIRONMENT_VARIABLES.md`
- Modify: `docs/OPENAI_INTEGRATION_PLAN.md`
- Modify: `docs/AI_ARCHITECTURE.md`

- [ ] **Step 1: Update Environment Documentation**
  Update `docs/ENVIRONMENT_VARIABLES.md` to document that the system is unified under DeepSeek V4 Pro, and the OpenAI variables are deprecated.

- [ ] **Step 2: Update AI Integration Plan**
  Update `docs/OPENAI_INTEGRATION_PLAN.md` to reflect that the OpenAI integration plan has been unified into a single Nvidia DeepSeek V4 Pro implementation.

- [ ] **Step 3: Update AI Architecture Documentation**
  Update `docs/AI_ARCHITECTURE.md` to declare DeepSeek V4 Pro as the sole AI model of the V1 architecture.

- [ ] **Step 4: Run full test suite**
  Run: `npm.cmd run test`
  Expected: PASS (All 255 tests pass)

- [ ] **Step 5: Commit**
  Run:
  ```bash
  git add docs/ENVIRONMENT_VARIABLES.md docs/OPENAI_INTEGRATION_PLAN.md docs/AI_ARCHITECTURE.md
  git commit -m "docs: document deepseek v4 pro single-model unification"
  ```
