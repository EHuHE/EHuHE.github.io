const externalUrlPattern = /^(?:[a-z][a-z\d+.-]*:|#)/i;

export function getBasePath(basePath = import.meta.env.BASE_URL): string {
  if (!basePath || basePath === "/") {
    return "/";
  }

  return `/${basePath.replace(/^\/+|\/+$/g, "")}/`;
}

export function withBasePath(path: string, basePath = import.meta.env.BASE_URL): string {
  if (externalUrlPattern.test(path)) {
    return path;
  }

  const base = getBasePath(basePath);
  const normalizedPath = path.replace(/^\/+/, "");

  if (!normalizedPath) {
    return base;
  }

  return `${base}${normalizedPath}`;
}

export function withoutBasePath(path: string, basePath = import.meta.env.BASE_URL): string {
  const base = getBasePath(basePath);

  if (base === "/" || !path.startsWith(base)) {
    return path;
  }

  const strippedPath = `/${path.slice(base.length)}`;
  return strippedPath === "//" ? "/" : strippedPath;
}

export function isSafeContentUrl(value: string): boolean {
  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);
    return ["https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}
