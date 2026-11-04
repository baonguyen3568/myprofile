import { describe, expect, it } from 'vitest';
import { content } from '../src/site/content';

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]));
  }
  return typeof value;
}

describe('localized portfolio content', () => {
  it('keeps English and Vietnamese copy structurally aligned', () => {
    expect(shape(content.vi)).toEqual(shape(content.en));
  });

  it('never uses semicolons in Vietnamese prose', () => {
    const text = JSON.stringify(content.vi.projects) + JSON.stringify(content.vi.about) + JSON.stringify(content.vi.journey);
    expect(text).not.toContain(';');
  });
});
