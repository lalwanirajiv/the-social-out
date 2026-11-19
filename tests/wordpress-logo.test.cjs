const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const filename = path.join(__dirname, "../src/lib/wordpress.ts");
const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function loadLogoGetter(fetchMock) {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    process: { env: { NEXT_PUBLIC_WORDPRESS_URL: "https://cms.example.test/" } },
    fetch: fetchMock,
    URLSearchParams,
  }, { filename });
  return exports.getHeaderLogo;
}

function response(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

const section = [{ id: 29, slug: "header-logo" }];
const logoUrl = "https://cms.example.test/wp-content/uploads/logo.png";

test("header and footer share one request and receive the newest image", async () => {
  const calls = [];
  const getHeaderLogo = loadLogoGetter(async (url, options) => {
    calls.push({ url: new URL(url), options });
    return calls.length === 1 ? response(section) : response([
      { media_type: "file", source_url: "https://cms.example.test/newer-video.mp4" },
      { media_type: "image", source_url: logoUrl },
      { media_type: "image", source_url: "https://cms.example.test/older-logo.png" },
    ]);
  });

  const headerRequest = getHeaderLogo();
  const footerRequest = getHeaderLogo();
  assert.equal(headerRequest, footerRequest);
  assert.equal(await headerRequest, logoUrl);
  assert.equal(await footerRequest, logoUrl);
  assert.equal(await getHeaderLogo(), logoUrl);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url.searchParams.get("slug"), "header-logo");
  assert.equal(calls[0].url.pathname, "/wp-json/wp/v2/socialout_media_sections");
  assert.equal(calls[1].url.searchParams.get("socialout_media_sections"), "29");
  assert.equal(calls[1].url.searchParams.get("orderby"), "date");
  assert.equal(calls[1].url.searchParams.get("order"), "desc");
  assert.ok(calls.every(({ options }) => options.cache === "no-store"));
});

test("a missing header-logo section returns null without fetching media", async () => {
  let calls = 0;
  const getHeaderLogo = loadLogoGetter(async () => {
    calls++;
    return response([]);
  });
  assert.equal(await getHeaderLogo(), null);
  assert.equal(calls, 1);
});

test("a section without an image returns null for the text fallback", async () => {
  let calls = 0;
  const getHeaderLogo = loadLogoGetter(async () => {
    calls++;
    return calls === 1 ? response(section) : response([
      { media_type: "file", source_url: "https://cms.example.test/video.mp4" },
    ]);
  });
  assert.equal(await getHeaderLogo(), null);
});

test("a failed request can be retried", async () => {
  let calls = 0;
  const getHeaderLogo = loadLogoGetter(async () => {
    calls++;
    if (calls === 1) return response(null, 503);
    if (calls === 2) return response(section);
    return response([{ media_type: "image", source_url: logoUrl }]);
  });
  await assert.rejects(getHeaderLogo(), /Cannot fetch WordPress section: header-logo/);
  assert.equal(await getHeaderLogo(), logoUrl);
  assert.equal(calls, 3);
});

test("a media endpoint error is surfaced instead of returning an invalid logo", async () => {
  let calls = 0;
  const getHeaderLogo = loadLogoGetter(async () => {
    calls++;
    return calls === 1 ? response(section) : response(null, 500);
  });
  await assert.rejects(getHeaderLogo(), /Cannot fetch header-logo media: HTTP 500/);
});
