import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with the hero, nav, and contact form visible", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/RG Stack/i);
    await expect(page.getByRole("navigation").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
  });

  test("switching language to Arabic flips the page to RTL", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "AR" }).click();

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  });

  test("a broken link falls back to the not-found page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /doesn't exist/i })).toBeVisible();
  });
});


test.describe("Admin", () => {
  test("admin login page is reachable", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "لوحة إدارة الأعمال" })).toBeVisible();
    await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
    await expect(page.getByLabel("كلمة المرور")).toBeVisible();
  });
});
