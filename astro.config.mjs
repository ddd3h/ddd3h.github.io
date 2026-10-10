// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import shellscript from 'shiki/langs/shellscript.mjs';

// Palette derived from the site's tokens (--link navy, --muted grey) plus a few
// muted accents, so highlighted code reads as part of the page.
/** @type {import('shiki').ThemeRegistration} */
const codeTheme = {
  name: 'ddd3h-light',
  type: 'light',
  fg: '#1A1D21',
  bg: '#F4F5F7',
  settings: [
    { settings: { foreground: '#1A1D21' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#8A9099', fontStyle: 'italic' } },
    { scope: ['entity.name.command', 'support.function', 'meta.function-call entity.name.function'], settings: { foreground: '#1B4A8F', fontStyle: 'bold' } },
    { scope: ['constant.other.option', 'constant.other.option.dash', 'variable.parameter'], settings: { foreground: '#0F7F7A' } },
    { scope: ['string.quoted', 'punctuation.definition.string'], settings: { foreground: '#2F7D4F' } },
    { scope: ['punctuation.separator.prompt'], settings: { foreground: '#8A9099' } },
    { scope: ['variable', 'punctuation.definition.variable', 'variable.other'], settings: { foreground: '#8A4FB5' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character.escape'], settings: { foreground: '#B4561A' } },
    { scope: ['keyword', 'keyword.control', 'storage.type'], settings: { foreground: '#C2255C' } },
    { scope: ['keyword.operator', 'punctuation.separator', 'keyword.operator.pipe', 'keyword.operator.redirect'], settings: { foreground: '#C2255C' } },
  ],
};

// Shiki's built-in `console` grammar leaves the first command after `$` without
// a command-name scope, so it never gets highlighted. This grammar reuses the
// shell rules for the `$ ...` lines and treats everything else as plain output.
const termGrammar = {
  name: 'term',
  scopeName: 'source.term',
  embeddedLangs: ['shellscript'],
  patterns: [
    {
      begin: '^(\\$) ',
      beginCaptures: { 1: { name: 'punctuation.separator.prompt.term' } },
      end: '$',
      patterns: [{ include: 'source.shell#command_statement' }, { include: 'source.shell' }],
    },
    { match: '^.*$', name: 'meta.output.term' },
  ],
};

export default defineConfig({
  site: 'https://www.ddd3h.com',
  integrations: [mdx(), sitemap()],
  // Light theme so code blocks sit on the site's flat light palette instead of
  // the default dark github-dark box; background is overridden in BaseLayout.
  markdown: { shikiConfig: { theme: codeTheme, langs: [shellscript, termGrammar] } },
  prefetch: {
    prefetchAll: true,
    // 'hover' rather than 'viewport': the blog index links to every post, and the
    // viewport strategy fired all of them at once against the critical path.
    defaultStrategy: 'hover',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
