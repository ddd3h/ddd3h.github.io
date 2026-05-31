import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags ?? [],
      lang: post.data.lang,
    },
  }));
}

let fontBuffer: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontBuffer) return fontBuffer;
  // Use old User-Agent → Google Fonts returns TTF (satori supports TTF/OTF/WOFF, not WOFF2)
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap',
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } }
  ).then(r => r.text());
  const urls = [...css.matchAll(/url\(["']?(https:\/\/fonts\.gstatic\.com\/[^"')]+)["']?\)/g)].map(m => m[1]);
  if (!urls.length) throw new Error(`Font URL not found. CSS snippet: ${css.slice(0, 400)}`);
  fontBuffer = await fetch(urls[0]).then(r => r.arrayBuffer());
  return fontBuffer;
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description, tags, lang } = props as {
    title: string;
    description: string;
    tags: string[];
    lang: string;
  };

  const font = await getFont();

  const tagColors: Record<string, string> = {
    astrophysics: '#8e44ad', agn: '#8e44ad', simulation: '#2980b9',
    'galaxy formation': '#2980b9', linux: '#27ae60', ubuntu: '#e67e22',
    tng_catcher: '#16a085', 天文学: '#8e44ad', 研究: '#c0392b', default: '#2a6496',
  };

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1a2636 0%, #2c3e50 60%, #1e3a5f 100%)',
          padding: '64px 72px 56px',
          fontFamily: 'Noto Sans JP',
          position: 'relative',
        },
        children: [
          // top accent bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '8px',
                height: '100%',
                background: 'linear-gradient(180deg, #3a85c8, #2a6496)',
                borderRadius: '0 4px 4px 0',
              },
            },
          },
          // tags row
          {
            type: 'div',
            props: {
              style: { display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' },
              children: tags.slice(0, 4).map(tag => ({
                type: 'div',
                props: {
                  style: {
                    background: tagColors[tag.toLowerCase()] ?? tagColors.default,
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 400,
                    padding: '4px 16px',
                    borderRadius: '20px',
                  },
                  children: tag,
                },
              })),
            },
          },
          // title
          {
            type: 'div',
            props: {
              style: {
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 40 ? '44px' : '54px',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.35,
                      letterSpacing: lang === 'ja' ? '0.02em' : '0',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          // footer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '32px',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                paddingTop: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '12px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2a6496, #3a85c8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            color: '#fff',
                            fontWeight: 700,
                          },
                          children: 'DN',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '2px' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: { fontSize: '20px', fontWeight: 700, color: '#ecf0f1' },
                                children: 'Daisuke Nishihama',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { fontSize: '16px', color: '#bdc3c7' },
                                children: '西濱 大将',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: '18px', color: '#7f8c8d', letterSpacing: '0.03em' },
                    children: 'ddd3h.com',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Noto Sans JP', data: font, weight: 400, style: 'normal' },
        { name: 'Noto Sans JP', data: font, weight: 700, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
