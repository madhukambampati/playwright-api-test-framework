# Playwright API Test Framework

API-first test automation framework built with **Playwright** and **TypeScript**, targeting the public [Restful Booker](https://restful-booker.herokuapp.com) API. Built to demonstrate the patterns I use for production test suites: layered service clients, runtime contract validation, data factories, and CI quality gates.

[![API Tests](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

## Design decisions

**Service-object clients, not inline requests.** Every endpoint lives behind a typed client (`src/api/clients/`). Specs read as intent — `bookingClient.create(payload)` — and an endpoint change is a one-file fix, not a find-and-replace across the suite.

**Raw vs. validated methods.** Each client exposes `createRaw()` (untouched `APIResponse`, for negative tests asserting on status codes and error bodies) and `create()` (asserts 2xx, validates the contract, returns typed data). Negative testing is a first-class concern, not an afterthought.

**Runtime contract validation with zod.** TypeScript types disappear at runtime. Every response body is parsed against a zod schema (`src/api/schemas/`) before any assertion runs, so a backend contract drift — renamed field, `number` → `string`, dropped property — fails with a readable diff pointing at the actual cause.

**Data factories over fixtures files.** `buildBooking(overrides)` generates unique realistic data per test via faker; a test overrides only the fields it is *about*, keeping intent visible at the call site and eliminating cross-test data coupling.

**Fail-fast CI with quality gates.** Lint and typecheck run before any test. The smoke suite (`@smoke`) runs before the full regression, so a broken deploy is reported in seconds. HTML and JUnit reports are published as artifacts on every run; a nightly scheduled run catches upstream drift.

**Deliberate quirk pinning.** Restful Booker has documented oddities (auth failures return `200` with a reason body; `DELETE` returns `201`). The suite asserts these *explicitly with comments*, so a silent behaviour change is caught and the next engineer understands why the assertion looks unusual.

## Structure

```
├── .github/workflows/ci.yml       # lint → typecheck → smoke → regression
├── src/
│   ├── api/
│   │   ├── clients/               # service objects (auth, booking)
│   │   ├── schemas/               # zod runtime contracts
│   │   └── types/                 # compile-time types
│   ├── config/env.ts              # env validated at startup
│   └── utils/
│       ├── booking-factory.ts     # faker-based data factory
│       └── fixtures.ts            # Playwright fixtures wiring clients
└── tests/
    ├── auth/                      # token issuance, negative auth
    ├── bookings/                  # CRUD + authorization + malformed input
    └── health/                    # reachability with response-time SLA
```

## Running locally

```bash
npm ci
cp .env.example .env
npm test                # full suite
npm run test:smoke      # @smoke tagged tests only
npm run report          # open the HTML report
```

## Tagging strategy

| Tag           | Purpose                              | When it runs            |
| ------------- | ------------------------------------ | ----------------------- |
| `@smoke`      | Critical-path, fast, fail-fast       | Every push, first stage |
| `@regression` | Full coverage incl. negative paths   | Every push, nightly     |

## What I'd add for a production system

- Consumer-driven contract tests (Pact) against provider pipelines
- k6 performance baselines wired to the same service clients
- Test-impact analysis to select suites by changed code paths
- Observability hooks: emit run metrics to a dashboard for flake-rate trending

---

**Madhubabu Khambhampati** — Senior QA Automation Engineer / SDET
[LinkedIn](https://www.linkedin.com/in/madhu-babu-khambhampati-71296699/)
