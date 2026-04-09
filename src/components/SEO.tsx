import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

const BASE_URL = "https://kumawat-aditya.github.io/portfolio";
const DEFAULT_IMAGE = `${BASE_URL}/projects/ant-meta-bots/dashboard.png`;

export default function SEO({
  title,
  description,
  path = "/",
  image,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Aditya Kumawat`;
    const fullUrl = `${BASE_URL}${path}`;
    const ogImage = image || DEFAULT_IMAGE;

    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", fullUrl);
    setMeta("property", "og:image", ogImage);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    return () => {
      document.title =
        "Aditya Kumawat — Systems Engineer | Backend & Trading Infrastructure";
    };
  }, [title, description, path, image]);

  return null;
}
