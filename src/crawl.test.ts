import { expect, test } from 'vitest';
import { normalizeURL } from './crawl';
import { getHeadingFromHTML } from './crawl';
import { getFirstParagraphFromHTML } from './crawl';
import { getURLsFromHTML } from './crawl';
import { getImagesFromHTML } from './crawl';
import { extractPageData } from './crawl';

//Normalized URLs
test('secure connexion closing /', () => {
  expect(normalizeURL("https://boot.dev/blog/path/")).toBe("boot.dev/blog/path")
})

test('secure connexion', () => {
  expect(normalizeURL("https://boot.dev/blog/path")).toBe("boot.dev/blog/path")
})

test('http final /', () => {
  expect(normalizeURL("http://boot.dev/blog/path/")).toBe("boot.dev/blog/path")
})

test('http', () => {
  expect(normalizeURL("http://boot.dev/blog/path")).toBe("boot.dev/blog/path")
})

test('Get Heading only', () => {
  expect(getHeadingFromHTML(`<html>
  <body>
    <h1>Welcome to Boot.dev</h1>
    <main>
      <p>Learn to code by building real projects.</p>
      <p>This is the second paragraph.</p>
    </main>
  </body>
</html>`)).toBe("Welcome to Boot.dev")
})

test('no H1 only H2', () => {
  expect(getHeadingFromHTML(`<html>
  <body>
    <h2>Welcome to Boot.dev</h2>
    <main>
      <p>Learn to code by building real projects.</p>
      <p>This is the second paragraph.</p>
    </main>
  </body>
</html>`)).toBe("Welcome to Boot.dev")
})

//First paragraph from HTML

test('nothing', () => {
  expect(getFirstParagraphFromHTML(`<html>
  <body>
    <main>
   </main>
  </body>
</html>`)).toBe("")
})

test(' p in main', () => {
  expect(getFirstParagraphFromHTML(`<html>
  <body>
    <h1>Welcome to Boot.dev</h1>
    <main>
      <p>Learn to code by building real projects.</p>
      <p>This is the second paragraph.</p>
    </main>
  </body>
</html>`)).toBe("Learn to code by building real projects.")
})

test(' p in main and elsewhere', () => {
  expect(getFirstParagraphFromHTML(`<html>
  <body>
    <p> lolllll </p>
    <h1>Welcome to Boot.dev</h1>
    <main>
      <p>Learn to code by building real projects.</p>
      <p>This is the second paragraph.</p>
    </main>
  </body>
</html>`)).toBe("Learn to code by building real projects.")
})

test('no main', () => {
  expect(getFirstParagraphFromHTML(`<html>
  <body>

    <h1>Welcome to Boot.dev</h1>

      <p>Learn to code by building real projects.</p>
      <p>This is the second paragraph.</p>

  </body>
</html>`)).toBe("Learn to code by building real projects.")
})

//Get URLs from HTML: href attribute from a element.
test('getURLsFromHTML full URL', () => {
const inputURL = "https://crawler-test.com";
const inputBody = '<html> <body><a href="https://crawler-test.com">Go to Boot.dev</a><img src="/logo.png" alt="Boot.dev Logo" /></body></html>';

const actual = getURLsFromHTML(inputBody, inputURL);
const expected = ["https://crawler-test.com/"]

expect(actual).toEqual(expected);
});

test("getURLsFromHTML absolute", () => {
  const inputURL = "https://crawler-test.com";
  const inputBody = `<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>`;

  const actual = getURLsFromHTML(inputBody, inputURL);
  const expected = ["https://crawler-test.com/path/one"];

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML many a", () => {
  const inputURL = "https://crawler-test.com";
  const inputBody = `<html>
  <body>
    <a href="https://crawler-test.com">Go to Boot.dev</a>
    <img src="/logo.png" alt="Boot.dev Logo" />
    <a href="https://crawler-second-test.ca">Go to second test</a>
  </body>
</html>`;

  const actual = getURLsFromHTML(inputBody, inputURL);
  const expected = ["https://crawler-test.com/", "https://crawler-second-test.ca/"]

  expect(actual).toEqual(expected);
});

//get images from HTML
test('getImagesFromHTML full URL', () => {
const inputURL = "https://crawler-test.com";
const inputBody = '<html><body><img src="/logo.png" alt="Logo"></body></html>';

const actual = getImagesFromHTML(inputBody, inputURL);
const expected = ["https://crawler-test.com/logo.png"]

expect(actual).toEqual(expected);
});

test('getImagesFromHTML two URL', () => {
const inputURL = "https://crawler-test.com";
const inputBody = '<html><body><img src="/logo.png" alt="Logo"><img src="/pogo.png" alt="Pogo"></body></html>';

const actual = getImagesFromHTML(inputBody, inputURL);
const expected = ["https://crawler-test.com/logo.png", "https://crawler-test.com/pogo.png"]

expect(actual).toEqual(expected);
});

test('getImagesFromHTML total URL + relative URL', () => {
const inputURL = "https://crawler-test.com";
const inputBody = '<html><body><img src="https://crawler-test.com/logo.png" alt="Logo"><img src="/pogo.png" alt="Pogo"></body></html>';

const actual = getImagesFromHTML(inputBody, inputURL);
const expected = ["https://crawler-test.com/logo.png", "https://crawler-test.com/pogo.png"]

expect(actual).toEqual(expected);
});

//Extract page data
test("extractPageData basic", () => {
  const inputURL = "https://crawler-test.com";
  const inputBody = `
    <html><body>
      <h1>Test Title</h1>
      <p>This is the first paragraph.</p>
      <a href="/link1">Link 1</a>
      <img src="/image1.jpg" alt="Image 1">
    </body></html>
  `;

  const actual = extractPageData(inputBody, inputURL);
  const expected = {
    url: "https://crawler-test.com",
    heading: "Test Title",
    first_paragraph: "This is the first paragraph.",
    outgoing_links: ["https://crawler-test.com/link1"],
    image_urls: ["https://crawler-test.com/image1.jpg"],
  };

  expect(actual).toEqual(expected);
});