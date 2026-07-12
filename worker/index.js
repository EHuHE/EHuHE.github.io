function hasFileExtension(pathname) {
  const finalSegment = pathname.split("/").at(-1) ?? "";
  return finalSegment.includes(".");
}

export function getAssetCandidates(pathname) {
  const candidates = [pathname];

  if (pathname === "/") {
    candidates.push("/index.html");
  } else if (pathname.endsWith("/")) {
    candidates.push(`${pathname}index.html`);
  } else if (!hasFileExtension(pathname)) {
    candidates.push(`${pathname}/index.html`);
  }

  return candidates;
}

function createAssetRequest(request, pathname) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;

  return new Request(assetUrl, {
    method: request.method,
    headers: request.headers,
  });
}

const worker = {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }

    if (!env?.ASSETS?.fetch) {
      return new Response("Static asset binding unavailable", { status: 500 });
    }

    const pathname = new URL(request.url).pathname;

    for (const candidate of getAssetCandidates(pathname)) {
      const response = await env.ASSETS.fetch(createAssetRequest(request, candidate));
      if (response.status !== 404) {
        return response;
      }
    }

    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};

export default worker;
