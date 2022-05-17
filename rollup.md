Rollup commands for package.json

``` JSON
    "scripts": {
        "cs:eslint": "eslint --fix -c .eslintrc.js --ext .tsx,.ts,.jsx,.js ./src/",
        "cs:stylelint": "stylelint --fix ./src/**/*.scss",
        "cs": "concurrently \"npm run cs:eslint\" \"npm run cs:stylelint\"",
        "serve:browser-sync": "browser-sync start --config bs-config.js",
        "serve:styles": "postcss ./src/**/*.scss --watch --base ./src/ --dir ./dist.tmp/",
        "serve:scripts": "tsc --project tsconfig.json --watch --preserveWatchOutput",
        "serve:bundle_landing_es2015": "rollup --config --watch --environment NODE_ENV:development,APP:Landing_es2015",
        "serve:bundle_landing_es5": "rollup --config --watch --environment NODE_ENV:development,APP:Landing_es5",
        "serve:bundle_cabinete_es2015": "rollup --config --watch --environment NODE_ENV:development,APP:Cabinet_es2015",
        "serve:bundle_cabinete_es5": "rollup --config --watch --environment NODE_ENV:development,APP:Cabinet_es5",
        "serve:bundle_polyfills_es2015": "rollup --config --watch --environment NODE_ENV:development,APP:Polyfills_es2015",
        "serve:bundle_polyfills_es5": "rollup --config --watch --environment NODE_ENV:development,APP:Polyfills_es5",
        "serve": "concurrently \"npm run build:styles\" \"npm run build:scripts\" && concurrently --kill-others \"npm run serve:browser-sync\" \"npm run serve:styles\" \"npm run serve:scripts\" \"npm run serve:bundle_landing_es2015\"  \"npm run serve:bundle_landing_es5\" \"npm run serve:bundle_polyfills_es2015\" \"npm run serve:bundle_polyfills_es5\" \"npm run serve:bundle_cabinete_es2015\" \"npm run serve:bundle_cabinete_es5\"",
        "build:static": "copyfiles -u 1 ./src/**/*.{ico,svg,eot,ttf,woff,woff2,pdf,gif,webmanifest} ./dist/",
        "build:images": "node ./buildscripts/min-images.js",
        "build:html": "html-minifier --input-dir ./src/ --output-dir ./dist/ --file-ext html --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --use-short-doctype --minify-css true --minify-js true && node ./buildscripts/set-html-timestmap.js",
        "build:styles": "postcss ./src/**/*.scss --base ./src/ --dir ./dist.tmp/",
        "build:scripts": "tsc --project tsconfig.json",
        "build:bundle_landing_es2015": "rollup --config --environment NODE_ENV:production,APP:Landing_es2015",
        "build:bundle_landing_es5": "rollup --config --environment NODE_ENV:production,APP:Landing_es5",
        "build:bundle_cabinete_es2015": "rollup --config --environment NODE_ENV:production,APP:Cabinet_es2015",
        "build:bundle_cabinete_es5": "rollup --config --environment NODE_ENV:production,APP:Cabinet_es5",
        "build:bundle_polyfills_es2015": "rollup --config --environment NODE_ENV:production,APP:Polyfills_es2015",
        "build:bundle_polyfills_es5": "rollup --config --environment NODE_ENV:production,APP:Polyfills_es5",
        "build": "concurrently \"npm run build:styles\" \"npm run build:scripts\" && concurrently \"npm run build:static\" \"npm run build:images\" \"npm run build:html\" \"npm run build:bundle_landing_es2015\" \"npm run build:bundle_landing_es5\" \"npm run build:bundle_polyfills_es2015\" \"npm run build:bundle_polyfills_es5\" \"npm run build:bundle_cabinete_es2015\" \"npm run build:bundle_cabinete_es5\"",
        "prepublishOnly": "npm version patch"
    },
```