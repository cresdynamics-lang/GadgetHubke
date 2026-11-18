import assert from "node:assert/strict";
import test from "node:test";

import { liveSettingsProblem } from "./stanbic-config.ts";

const KEYS = ["PAYMENTS_MODE", "STANBIC_API_BASE", "STANBIC_TOKEN_URL", "STANBIC_STK_PATH", "STANBIC_STATUS_URL", "STANBIC_CLIENT_ID", "STANBIC_CLIENT_SECRET"];

function withEnv(env: Record<string, string>, run: () => void) {
  const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
  for (const k of KEYS) delete process.env[k];
  Object.assign(process.env, { STANBIC_CLIENT_ID: "id", STANBIC_CLIENT_SECRET: "secret" }, env);
  try {
    run();
  } finally {
    for (const k of KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
}

test("live mode with sandbox addresses is not ready", () => {
  withEnv({ PAYMENTS_MODE: "live" }, () => {
    assert.match(liveSettingsProblem(), /STANBIC_API_BASE/);
  });
  withEnv({ PAYMENTS_MODE: "live", STANBIC_API_BASE: "https://sandbox.connect.stanbicbank.co.ke/api/sandbox", STANBIC_STATUS_URL: "https://x.example/status" }, () => {
    assert.match(liveSettingsProblem(), /sandbox address/);
  });
});

test("live mode with production addresses is ready, and sandbox mode is unaffected", () => {
  withEnv({ PAYMENTS_MODE: "live", STANBIC_API_BASE: "https://api.example.co.ke/api/prod", STANBIC_STATUS_URL: "https://api.example.co.ke/api/prod/transaction-status/" }, () => {
    assert.equal(liveSettingsProblem(), "");
  });
  withEnv({ PAYMENTS_MODE: "sandbox" }, () => assert.equal(liveSettingsProblem(), ""));
});
