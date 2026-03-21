# PinProf.com

Standalone marketing site for the PinProf app.

## Local preview

```sh
npm run preview
```

Then open [http://127.0.0.1:4321](http://127.0.0.1:4321).

## Deployment

There is no separate deploy script in this repo right now.

`pinprof.com` is currently deployed through the main website deploy script in [deploy.sh](/Users/pillyliu/Documents/Codex/Pillyliu%20Pinball%20Website/deploy.sh).

On your current machine layout, the main deploy script now auto-detects this sibling repo and deploys it by default.

Default command:

```sh
/Users/pillyliu/Documents/Codex/Pillyliu\ Pinball\ Website/deploy.sh
```

If you ever need to override the source or remote docroot manually, set `PINPROF_SITE_SOURCE_DIR` and `PINPROF_SITE_REMOTE_ROOT` before running the main deploy:

```sh
PINPROF_SITE_SOURCE_DIR="/Users/pillyliu/Documents/Codex/PinProf.com" \
PINPROF_SITE_REMOTE_ROOT="/absolute/remote/docroot/for/pinprof.com" \
  /Users/pillyliu/Documents/Codex/Pillyliu\ Pinball\ Website/deploy.sh
```

The `_headers` file is preserved from the original site source, but it is not a KnownHost deploy config.
