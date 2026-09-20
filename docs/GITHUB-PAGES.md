# GitHub Pages deployment

The website can run as a static GitHub Pages site. The normal `npm run build` still produces the full Next.js app with its enquiry API for future hosting.

## Publish

The repository is `ChauhanAbhi07/ODDSTACK`. Enable **Settings → Pages → Source → GitHub Actions**. The workflow in `.github/workflows/pages.yml` publishes on pushes to `main` or manual runs. It builds public content only; unpublished case studies and articles stay excluded. No environment secrets, local enquiry files or database are deployed.

Expected address: `https://chauhanabhi07.github.io/ODDSTACK/`. This address is live only after GitHub reports a successful Pages deployment. Private repositories require a GitHub plan that supports Pages; changing a private repository to public requires the owner's decision because source files and commit history become visible.

The public email links use `iamabhishekk2003@gmail.com`. To change it, set the repository Actions variable `CONTACT_EMAIL` and rerun the workflow. No email API key is needed for this static version.

## Enquiries

The wizard validates the visitor's details and prepares an email draft. Visitors must open their email app and send it, or copy the full brief into webmail. It never posts to a backend, reports an automatic send or stores a copy. The Resend and PostgreSQL integrations remain in the source for a future server deployment.

## Build and check locally

```powershell
npm.cmd run build:pages
npm.cmd run test:pages
npm.cmd run preview:pages
```

Open `http://127.0.0.1:4173/ODDSTACK/`. The static preview server binds to this computer only. For normal development and Wi-Fi phone previews, keep using `npm.cmd run dev`.

The exporter uses a fresh ignored directory under `.pages-build`, copies only the required source/configuration files, omits server API routes and empty unpublished detail routes, and writes `.nojekyll`. It leaves the working source tree and local credentials intact. Next.js 16.3 Windows RSC filenames are normalized to the format the client requests. The Pages workflow builds on Linux.

`NEXT_PUBLIC_SITE_URL` supplies the public URL and repository base path at build time. The workflow reads it from GitHub's Pages configuration, so asset paths and canonical URLs use the actual Pages address. The browser checks assume the default `/ODDSTACK/` project path.

Before adding automatic email delivery, move to a host that runs the full Next.js app or connect an external form service; GitHub Pages cannot execute API routes.

References: [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Pages deployment workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
