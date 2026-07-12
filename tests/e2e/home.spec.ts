import { expect, test } from "@playwright/test";

test.describe("academic homepage and blog", () => {
  test("defaults to English and the light theme", async ({ page }) => {
    await page.goto("/");

    const documentElement = page.locator("html");
    await expect(documentElement).toHaveAttribute("lang", "en");
    await expect(documentElement).toHaveAttribute("data-lang", "en");
    await expect(documentElement).toHaveAttribute("data-theme", "light");
    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  });

  test("starts the quieter redesign in light mode and persists a new theme choice", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("opens with a compact academic introduction and two direct actions", async ({ page }) => {
    await page.goto("/");

    const profile = page.getByRole("region", { name: "He Hu" });
    await expect(profile.getByRole("heading", { name: "He Hu", level: 1 })).toBeVisible();
    await expect(profile.getByText("School of Cryptography, Hubei University", { exact: true })).toBeVisible();
    await expect(profile.getByText("Fang Binxing Academician Experimental Class", { exact: true })).toBeVisible();

    const researchClaim = profile.getByText(
      /^I study .*(?:LLM|language model).*(?:security|secure).*\.$/i,
    );
    await expect(researchClaim).toHaveCount(1);

    const portrait = profile.getByRole("img", { name: "AI-generated voxel portrait of He Hu" });
    await expect(portrait).toBeVisible();
    await expect(portrait).toBeInViewport();

    const portraitBox = await portrait.boundingBox();
    expect(portraitBox).not.toBeNull();
    expect(portraitBox!.width).toBeLessThanOrEqual(160);
    expect(portraitBox!.height).toBeLessThanOrEqual(160);

    await expect(profile.getByRole("link", { name: "Read notes", exact: true })).toHaveAttribute(
      "href",
      /\/posts\/?$/,
    );
    await expect(profile.getByRole("link", { name: "Email me", exact: true })).toHaveAttribute(
      "href",
      "mailto:202521120012751@stu.hubu.edu.cn",
    );
  });

  test("presents the three research focuses as one linear list", async ({ page }) => {
    await page.goto("/");

    const focus = page.getByRole("region", { name: "Research focus" });
    await expect(focus.getByRole("heading", { name: "Research focus", level: 2 })).toBeVisible();

    const focusList = focus.getByRole("list");
    await expect(focusList).toBeVisible();
    await expect(focusList.getByRole("listitem")).toHaveCount(3);
    await expect(focusList.getByRole("heading", { name: "AI & LLM Security", level: 3 })).toBeVisible();
    await expect(focusList.getByRole("heading", { name: "Cyber Defense", level: 3 })).toBeVisible();
    await expect(focusList.getByRole("heading", { name: "Reproducible Research", level: 3 })).toBeVisible();
  });

  test("shows only the three selected research notes and excludes paper-reading logs", async ({ page }) => {
    await page.goto("/");

    const selectedNotes = page.getByRole("region", { name: "Selected research notes" });
    await expect(
      selectedNotes.getByRole("heading", { name: "Selected research notes", level: 2 }),
    ).toBeVisible();
    await expect(selectedNotes.getByRole("article")).toHaveCount(3);

    const expectedNotes = [
      "提示注入威胁建模与防护实验设计",
      "LLM 安全代码生成评测：从 CWE 到防御性检查",
      "威胁情报推理学习记录：从文本摘要到防御线索",
    ];

    for (const title of expectedNotes) {
      await expect(selectedNotes.getByRole("link", { name: title, exact: true })).toBeVisible();
    }

    await expect(selectedNotes).not.toContainText("论文精读日志");
  });

  test("keeps the three academic identity routes together", async ({ page }) => {
    await page.goto("/");

    const details = page.getByRole("region", { name: "Contact & profiles" });
    await expect(details.getByRole("heading", { name: "Contact & profiles", level: 2 })).toBeVisible();

    const detailList = details.getByRole("list");
    await expect(detailList.getByRole("listitem")).toHaveCount(3);
    await expect(
      detailList.getByRole("link", { name: "202521120012751@stu.hubu.edu.cn" }),
    ).toHaveAttribute("href", "mailto:202521120012751@stu.hubu.edu.cn");
    await expect(detailList.getByRole("link", { name: "GitHub", exact: true })).toHaveAttribute(
      "href",
      "https://github.com/EHuHE",
    );
    await expect(detailList.getByRole("link", { name: "Homepage", exact: true })).toHaveAttribute(
      "href",
      "https://ehuhe.github.io/",
    );
  });

  test("translates the key homepage wayfinding and call to action", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Switch to Chinese" }).click();

    const documentElement = page.locator("html");
    await expect(documentElement).toHaveAttribute("lang", "zh-CN");
    await expect(documentElement).toHaveAttribute("data-lang", "zh");
    await expect(page.getByRole("heading", { name: "研究方向", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "精选研究笔记", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "联系与公开主页", level: 2 })).toBeVisible();
    await expect(page.getByRole("link", { name: "阅读笔记", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "给我发邮件", exact: true })).toHaveAttribute(
      "href",
      "mailto:202521120012751@stu.hubu.edu.cn",
    );

    await page.getByRole("button", { name: "Switch to English" }).click();

    await expect(documentElement).toHaveAttribute("lang", "en");
    await expect(documentElement).toHaveAttribute("data-lang", "en");
    await expect(page.getByRole("heading", { name: "Research focus", level: 2 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Read notes", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Email me", exact: true })).toBeVisible();
  });

  test("filters posts by tag", async ({ page }) => {
    await page.goto("/posts/");

    await page.getByRole("button", { name: "TypeScript" }).click();

    const visibleRows = page.getByTestId("post-row").filter({ visible: true });
    await expect(visibleRows).toHaveCount(2);
    await expect(visibleRows.first()).toContainText("TypeScript");
  });

  test("searches posts by title and description", async ({ page }) => {
    await page.goto("/posts/");

    await page.getByLabel("Search posts").fill("Astro");

    const visibleRows = page.getByTestId("post-row").filter({ visible: true });
    await expect(visibleRows).toHaveCount(2);
    await expect(visibleRows.first()).toContainText("Astro");
  });

  test("offers a contact route in the usable mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const openMenuButton = page.getByRole("button", { name: "Open navigation menu" });
    await expect(openMenuButton).toHaveAttribute("aria-expanded", "false");
    await openMenuButton.click();
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    const mobileNavigation = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNavigation).toBeVisible();
    await expect(mobileNavigation.getByRole("link", { name: "Contact", exact: true })).toHaveAttribute(
      "href",
      "mailto:202521120012751@stu.hubu.edu.cn",
    );

    await page.setViewportSize({ width: 1200, height: 844 });
    await expect(mobileNavigation).toBeHidden();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(mobileNavigation).toBeHidden();
    await expect(openMenuButton).toHaveAttribute("aria-expanded", "false");

    await openMenuButton.click();

    await mobileNavigation.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
  });
});
