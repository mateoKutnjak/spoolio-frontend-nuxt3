import { defineNuxtPlugin } from "#app";

import MarkdownIt from "markdown-it";
import md from "markdown-it";

export default defineNuxtPlugin(() => {
    const renderer = md();

    return {
        provide: {
            renderer,
        },
    };
});