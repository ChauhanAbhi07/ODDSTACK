# GitHub Pages deployment

The website can run as a static GitHub Pages site. The normal `npm run build` still produces the full Next.js app with its enquiry API for future hosting.

## Publish

The repository is `ChauhanAbhi07/ODDSTACK`. Enable **Settings → Pages → Source → GitHub Actions**. The workflow in `.github/workflows/pages.yml` publishes on pushes to `main` or manual runs. It builds public content only; unpublished case studies and articles stay excluded. No environment secrets, local enquiry files or database are deployed.

Expected address: `https://chauhanabhi07.github.io/ODDSTACK/`. This address is live only after GitHub reports a successful Pages deployment. Private repositories require a GitHub plan that supports Pages; changing a private repository to public requires the owner's decision because source files and commit history become visible.

The public email links use `hello@oddestack.com`. The form submits to `https://formspree.io/f/mqpebnqe`; the recipient `iamabhishekk2003@gmail.com` is configured and verified in the Formspree dashboard, not sent from the browser. No email API key is needed.

## Enquiries

Visitors describe their request in step one and enter contact details in step two. **Send enquiry** posts their name, email, message, selected services and optional context directly to Formspree, without opening an email app. Formspree uses `email` for reply-to. A success message appears only after Formspree confirms acceptance; it does not prove inbox delivery. Failures preserve answers for a manual retry.

The same Formspree flow is used in development and production. Automated tests intercept submissions; they must never send test data to the real inbox. The endpoint is public configuration, not a secret. Override `NEXT_PUBLIC_FORMSPREE_ENDPOINT` at build time if the form changes. The static exporter inherits this environment variable. Editing `.env.example` alone does not change a deployment.

The Resend and PostgreSQL API integrations remain available in the source but are not used by the current form. GitHub Pages does not deploy those API routes.

## Build and check locally

```powershell
npm.cmd run build:pages
npm.cmd run test:pages
npm.cmd run preview:pages
```

Open `http://127.0.0.1:4173/ODDSTACK/`. The static preview server binds to this computer only. For normal development and Wi-Fi phone previews, keep using `npm.cmd run dev`.

The exporter uses a fresh ignored directory under `.pages-build`, copies only the required source/configuration files, omits server API routes and empty unpublished detail routes, and writes `.nojekyll`. It leaves the working source tree and local credentials intact. Next.js 16.3 Windows RSC filenames are normalized to the format the client requests. The Pages workflow builds on Linux.

`NEXT_PUBLIC_SITE_URL` supplies the public URL and repository base path at build time. The workflow reads it from GitHub's Pages configuration, so asset paths and canonical URLs use the actual Pages address. The browser checks assume the default `/ODDSTACK/` project path.

Form notification recipients and spam settings are managed in Formspree. Keep the receiving inbox verified and monitor submission errors or quota limits there.

References: [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Pages deployment workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
