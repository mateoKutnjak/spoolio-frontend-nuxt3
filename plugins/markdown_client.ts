import { defineNuxtPlugin } from "#app";

import MarkdownIt from "markdown-it";

export default defineNuxtPlugin(() => {
    const markdown = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    });
    return {
        provide: {
            markdown,
        },
    };
});