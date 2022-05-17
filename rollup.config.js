import nodeResolve from "rollup-plugin-node-resolve";
import commonJs from "rollup-plugin-commonjs";
import visualizer from "rollup-plugin-visualizer";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import { string } from "rollup-plugin-string";
import babel from "rollup-plugin-babel";
import react from 'react';
import reactDom from 'react-dom';
import reactRouterDom from 'react-router-dom';
import tslib from 'tslib';

const isSourceMap = false;
const isRelease = process.env.NODE_ENV === "production";
const app = process.env.APP;

const getPlugins = (config) => {
    const plugins = [];
    const isESNext = config.isESNext;

    plugins.push(nodeResolve({
        mainFields: isESNext ? ["module", "jsnext:main", "main"] : ["main"],
        extensions: isESNext ? [".mjs", ".js", ".jsx", ".json"] : [".js", ".jsx", ".json"]
    }));

    plugins.push(commonJs({
        namedExports: {
            "react-is": ["isValidElementType"],
            "react": Object.keys(react),
            "react-dom": Object.keys(reactDom),
            "mobx": ["observable", "computed", "action"],
            "mobx-react": ["observer"],
            "class-validator": [
                "Validate", "ValidatorConstraint", "IsOptional", "MaxLength", "ValidationError",
                "ValidatorConstraintInterface", "ValidationArguments"
            ],
            "tslib": Object.keys(tslib),
            "react-router-dom": Object.keys(reactRouterDom),
            "classnames": ["classnames"]
        },
        include: "node_modules/**"
    }));

    if (!isESNext) {
        plugins.push(babel({
            // exclude: 'node_modules/**',
            runtimeHelpers: true,
            presets: [],
            plugins: [
                "@babel/plugin-transform-classes",
                "@babel/plugin-transform-arrow-functions",
                "@babel/plugin-transform-template-literals",
                "@babel/plugin-transform-spread",
                "@babel/plugin-transform-parameters",
                "@babel/plugin-transform-async-to-generator",
                "@babel/plugin-transform-regenerator",
                "@babel/plugin-transform-for-of",
                "@babel/plugin-transform-destructuring",
                "@babel/plugin-transform-shorthand-properties",
                "@babel/plugin-transform-runtime",
                "@babel/plugin-transform-block-scoping",
                "@babel/plugin-transform-unicode-regex"
            ]
        }));
    }

    plugins.push(string({
        include: "**/*.scss",
    }));

    plugins.push(replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }));

    if (isRelease) {
        plugins.push(terser({
            toplevel: true,
            sourcemap: isSourceMap
        }));
    }

    plugins.push(visualizer({
        filename: `.stats/${config.appName.toLowerCase().replace(" ", "_")}_stat.html`,
        title: config.appName,
        sourcemap: isSourceMap
    }));

    return plugins;
};

/**
 * Tasks
 */

const tasks = [];

if (app === "Landing_es2015") {
    tasks.push({
        input: "dist.tmp/landing/scripts/Main.js",
        output: {
            file: "dist/landing/scripts/main.es2015.min.js",
            format: "iife",
            sourcemap: isSourceMap
        },
        plugins: getPlugins({ appName: "LandingES2015", isESNext: true }),
    });
}

if (app === "Landing_es5") {
    tasks.push({
        input: "dist.tmp/landing/scripts/Main.js",
        output: {
            file: "dist/landing/scripts/main.es5.min.js",
            format: "iife",
            sourcemap: isSourceMap
        },
        plugins: getPlugins({ appName: "LandingES5", isESNext: false }),
    });
}

if (app === "Cabinet_es2015") {
    tasks.push({
        input: "dist.tmp/cabinet/scripts/Main.js",
        output: {
            file: "dist/cabinet/scripts/main.es2015.min.js",
            format: "iife",
            sourcemap: isSourceMap
        },
        plugins: getPlugins({ appName: "CabinetES2015", isESNext: true }),
    });
}

if (app === "Cabinet_es5") {
    tasks.push({
        input: "dist.tmp/cabinet/scripts/Main.js",
        output: {
            file: "dist/cabinet/scripts/main.es5.min.js",
            format: "iife",
            sourcemap: isSourceMap
        },
        plugins: getPlugins({ appName: "CabinetES5", isESNext: false }),
    });
}

if (app === "Polyfills_es2015") {
    tasks.push({
        input: "dist.tmp/core/scripts/polyfills.es2015.js",
        output: {
            file: "dist/core/scripts/polyfills.es2015.min.js",
            format: "iife",
            sourcemap: isSourceMap
        },
        plugins: getPlugins({ appName: "PolyfillsES2015", isESNext: true }),
    });
}

if (app === "Polyfills_es5") {
    tasks.push({
        input: "dist.tmp/core/scripts/polyfills.es5.js",
        output: {
            file: "dist/core/scripts/polyfills.es5.min.js",
            format: "iife",
            sourcemap: isSourceMap
        },
        plugins: getPlugins({ appName: "PolyfillsES5", isESNext: false }),
    });
}

tasks.push({
    input: "dist.tmp/core/scripts/pwa.serviceworker.js",
    output: {
        file: "dist/pwa.serviceworker.min.js",
        format: "iife",
        sourcemap: isSourceMap
    },
    plugins: getPlugins({appName: "ServiceWorker", tsconfig: "tsconfig.pwa.json"})
});

export default tasks;
