import { expect, test } from 'vitest'
import { normalizeURL } from './crawl'

test('https://www.boot.dev/blog/path/', () => {
  expect(normalizeURL("https://www.boot.dev/blog/path/")).toBe("www.boot.dev/blog/path")
})

test('https://www.boot.dev/blog/path', () => {
  expect(normalizeURL("https://www.boot.dev/blog/path")).toBe("www.boot.dev/blog/path")
})

test('http://www.boot.dev/blog/path/', () => {
  expect(normalizeURL("http://www.boot.dev/blog/path/")).toBe("www.boot.dev/blog/path")
})

test('http://www.boot.dev/blog/path', () => {
  expect(normalizeURL("http://www.boot.dev/blog/path")).toBe("www.boot.dev/blog/path")
})