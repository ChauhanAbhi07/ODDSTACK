import { publishedReviews } from "./reviews";

export const navigation = [
  { label: "Services", href: "/services" },
  ...(publishedReviews.length ? [{ label: "Reviews", href: "/#reviews" }] : []),
  { label: "Our experience", href: "/work" },
  { label: "About us", href: "/about" },
];

export const footerNavigation = [
  ...navigation,
  { label: "Team", href: "/team" },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];
