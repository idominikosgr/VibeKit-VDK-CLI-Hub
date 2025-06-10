import { Klass, LexicalNode, LexicalNodeReplacement, ParagraphNode, TextNode } from 'lexical'
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListNode, ListItemNode } from "@lexical/list"
import { LinkNode, AutoLinkNode } from "@lexical/link"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
  ]
