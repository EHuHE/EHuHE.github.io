import { expect, test } from "@playwright/test";

test.describe("academic homepage and blog", () => {
  test("shows the academic identity and navigates to posts", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "He Hu" })).toBeVisible();
    await expect(page.getByLabel("Contact").getByText("202521120012751@stu.hubu.edu.cn")).toBeVisible();
    await expect(page.getByLabel("Contact").getByText("School of Cryptography, Hubei University")).toBeVisible();
    await expect(page.getByLabel("Contact").getByText("Fang Binxing Academician Experimental Class")).toBeVisible();
    await expect(page.getByLabel("Contact").getByText("方滨兴院士实验班")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Research Interests" })).toBeVisible();

    await page.getByRole("link", { name: "Read Posts" }).click();
    await expect(page).toHaveURL(/\/posts\/?$/);
    await expect(page.getByRole("heading", { name: "Research Notes" })).toBeVisible();
  });

  test("toggles dark theme", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /Switch to dark theme/ }).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: /Switch to light theme/ })).toBeVisible();
  });

  test("filters posts by tag", async ({ page }) => {
    await page.goto("/posts/");

    await page.getByRole("button", { name: "TypeScript" }).click();

    const visibleRows = page.locator('[data-testid="post-row"]:visible');
    await expect(visibleRows).toHaveCount(2);
    await expect(visibleRows.first()).toContainText("TypeScript");
  });

  test("searches posts by title and description", async ({ page }) => {
    await page.goto("/posts/");

    await page.getByLabel("Search posts").fill("Astro");

    const visibleRows = page.locator('[data-testid="post-row"]:visible');
    await expect(visibleRows).toHaveCount(2);
    await expect(visibleRows.first()).toContainText("Astro");
  });

  test("opens mobile navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation menu" }).click();

    await expect(page.getByTestId("mobile-nav")).toBeVisible();
    await expect(page.getByTestId("mobile-nav").getByRole("link", { name: "About" })).toBeVisible();
  });
});
