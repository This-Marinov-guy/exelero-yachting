import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Specific test mocks are registered after this guard. Any new form write
  // path fails closed instead of reaching a real API or Supabase table.
  await page.route("**/*", async route => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method()) &&
        (/^\/api\//.test(pathname) || /^\/(rest|storage)\/v1\//.test(pathname))) {
      throw new Error(`Unmocked form write blocked: ${request.method()} ${pathname}`);
    }
    await route.continue();
  });
});

function futureDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
}

async function chooseDate(page: Page, selector: string, value: string) {
  const input = page.locator(selector);
  await input.fill(value);
  await input.press("Enter");
  await expect(input).toHaveValue(value);
}

async function blockNotifications(page: Page) {
  const calls: unknown[] = [];
  await page.route("**/api/notify", async route => {
    calls.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  return calls;
}

async function mockSupabaseInsert(page: Page, table: string) {
  const inserted: Record<string, unknown>[] = [];
  await page.route(`**/rest/v1/${table}**`, async route => {
    const request = route.request();
    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "apikey, authorization, content-type, prefer, x-client-info",
    };
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: cors });
      return;
    }
    expect(request.method()).toBe("POST");
    inserted.push(request.postDataJSON());
    await route.fulfill({ status: 201, headers: { ...cors, "content-type": "application/json" }, body: "" });
  });
  return inserted;
}

async function fillInquiry(page: Page) {
  const form = page.getByRole("form", { name: /^Contact about / });
  await form.getByLabel("Name", { exact: true }).fill("Form Test");
  await form.getByLabel("Email", { exact: true }).fill("form-test@example.test");
  await form.getByLabel(/^Message/).fill("Please contact me.");
  for (const field of await form.locator("[required]").all()) {
    const name = await field.getAttribute("name");
    if (name === "name" || name === "email") continue;
    if (await field.inputValue()) continue;
    if (await field.evaluate(element => element.tagName === "SELECT")) await field.selectOption({ index: 1 });
    else await field.fill("Form test answer");
  }
  await form.getByRole("button", { name: "Send inquiry" }).click();
  return form;
}

test("Contact form validates and submits without saving or emailing", async ({ page }) => {
  const submitted: Record<string, unknown>[] = [];
  await page.route("**/api/contact", async route => {
    submitted.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto("/contact");
  const form = page.locator("form.contact-form");
  await form.getByRole("button", { name: "Send inquiry" }).click();
  await expect(form.getByText("First name is required")).toBeVisible();
  expect(submitted).toHaveLength(0);

  await form.getByPlaceholder("First Name").fill("Form");
  await form.getByPlaceholder("Last Name").fill("Test");
  await form.getByPlaceholder("Phone Number").fill("1234567890");
  await form.getByPlaceholder("Email").fill("form-test@example.test");
  await form.getByPlaceholder("Tell us how we can help").fill("Please contact me.");
  await form.getByRole("button", { name: "Send inquiry" }).click();
  await expect.poll(() => submitted.length).toBe(1);
  expect(submitted[0]).toEqual({
    firstName: "Form", lastName: "Test", number: "1234567890",
    email: "form-test@example.test", message: "Please contact me.",
  });
  await expect(form.getByPlaceholder("First Name")).toHaveValue("");
});

test("Charter request submits its model and dates without saving or emailing", async ({ page }) => {
  const notifications = await blockNotifications(page);
  const inserted = await mockSupabaseInsert(page, "charter_requests");
  await page.goto("/services/charters");
  const form = page.locator("form.charter-form");
  await form.locator("#charter-type").selectOption("X-Yachts Xc 47");
  await chooseDate(page, "#charter-date-from", futureDate(30));
  await chooseDate(page, "#charter-date-to", futureDate(37));
  await form.locator("#charter-group-size").fill("4");
  await form.locator("#charter-email").fill("form-test@example.test");
  await form.locator("#charter-name").fill("Form Test");
  await expect(form.locator("#charter-date-from")).toHaveValue(futureDate(30));
  await expect(form.locator("#charter-date-to")).toHaveValue(futureDate(37));
  await form.getByRole("button", { name: "Send request" }).click();
  await expect.poll(() => inserted.length).toBe(1);
  expect(inserted[0]).toMatchObject({
    name: "Form Test", email: "form-test@example.test",
    charter_type: "X-Yachts Xc 47", group_size: 4,
  });
  await expect.poll(() => notifications.length).toBe(1);
});

test("Transportation request submits its route without saving or emailing", async ({ page }) => {
  const notifications = await blockNotifications(page);
  const inserted = await mockSupabaseInsert(page, "transportation_requests");
  await page.goto("/services/transportation");
  const form = page.locator("form.transportation-form");
  await chooseDate(page, "#transport-date-start", futureDate(30));
  await chooseDate(page, "#transport-deadline-date", futureDate(37));
  await form.locator("#transport-start-point").fill("Athens");
  await form.locator("#transport-end-point").fill("Amsterdam");
  await form.locator("#transport-length").fill("12");
  await form.locator("#transport-email").fill("form-test@example.test");
  await form.locator("#transport-name").fill("Form Test");
  await expect(form.locator("#transport-date-start")).toHaveValue(futureDate(30));
  await expect(form.locator("#transport-deadline-date")).toHaveValue(futureDate(37));
  await form.getByRole("button", { name: "Send request" }).click();
  await expect.poll(() => inserted.length).toBe(1);
  expect(inserted[0]).toMatchObject({
    name: "Form Test", email: "form-test@example.test",
    start_point: "Athens", end_point: "Amsterdam", boat_length_m: 12,
  });
  await expect.poll(() => notifications.length).toBe(1);
});

test("Boat inquiry submits contact details without saving or emailing", async ({ page }) => {
  const submitted: Record<string, unknown>[] = [];
  await page.route("**/api/boats/*/inquiries", async route => {
    submitted.push(route.request().postDataJSON());
    await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ ok: true, notification: "pending" }) });
  });
  await page.goto("/services/brokerage");
  const firstBoat = page.locator('a[href^="/services/brokerage/"]').first();
  await expect(firstBoat, "Seed an active boat listing to run this test").toBeVisible();
  await firstBoat.click();
  await fillInquiry(page);
  await expect.poll(() => submitted.length).toBe(1);
  expect(submitted[0]).toMatchObject({ name: "Form Test", email: "form-test@example.test", message: "Please contact me." });
  expect(submitted[0].request_id).toMatch(/^[0-9a-f-]{36}$/i);
});

test("Partner inquiry submits contact details without saving or emailing", async ({ page }) => {
  const submitted: Record<string, unknown>[] = [];
  await page.route("**/api/partners/*/inquiries", async route => {
    submitted.push(route.request().postDataJSON());
    await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ ok: true, notification: "pending" }) });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Partners" }).click();
  const firstPartner = page.locator('a[href^="/partners/"]').first();
  await expect(firstPartner, "Seed a published partner to run this test").toBeVisible();
  await firstPartner.click();
  await fillInquiry(page);
  await expect.poll(() => submitted.length).toBe(1);
  expect(submitted[0]).toMatchObject({ name: "Form Test", email: "form-test@example.test", message: "Please contact me." });
  expect(submitted[0].request_id).toMatch(/^[0-9a-f-]{36}$/i);
});
