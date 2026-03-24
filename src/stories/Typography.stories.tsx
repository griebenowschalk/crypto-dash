import type { Meta, StoryObj } from '@storybook/react';
import {
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Large,
  Small,
  Muted,
  SectionLabel,
  Blockquote,
  Code,
} from '@/components/typography';

const meta: Meta = {
  title: 'UI/Typography',
  tags: ['autodocs'],
};

export default meta;

export const Headings: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <H1>H1 — Heading One</H1>
      <H2>H2 — Heading Two</H2>
      <H3>H3 — Heading Three</H3>
      <H4>H4 — Heading Four</H4>
    </div>
  ),
};

export const Body: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <Lead>Lead paragraph — used for introductory text</Lead>
      <P>Paragraph — standard body text with comfortable line height</P>
      <Large>Large — emphasized body text</Large>
      <Small>Small — compact label text</Small>
      <Muted>Muted — secondary / de-emphasised text</Muted>
    </div>
  ),
};

export const Labels: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <SectionLabel>Section Label</SectionLabel>
      <Blockquote>Blockquote — highlighted quote or note</Blockquote>
      <Code>code snippet</Code>
    </div>
  ),
};
