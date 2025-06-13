import { EditorThemeClasses } from 'lexical'

import './editor-theme.css'

export const editorTheme: EditorThemeClasses = {
  ltr: 'text-left',
  rtl: 'text-right',
  heading: {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    h6: 'scroll-m-20 text-base font-semibold tracking-tight',
  },
  paragraph: 'leading-7 not-first:mt-6',
  quote: 'mt-6 border-l-2 pl-6 italic',
  link: 'text-blue-600 hover:underline hover:cursor-pointer',
  list: {
    checklist: 'relative',
    listitem: 'mx-8',
    listitemChecked:
      'relative mx-2 px-6 list-none outline-none line-through before:content-[""] before:w-4 before:h-4 before:top-0.5 before:left-0 before:cursor-pointer before:block before:bg-cover before:absolute before:border before:border-primary before:rounded before:bg-primary before:bg-no-repeat after:content-[""] after:cursor-pointer after:border-white after:border-solid after:absolute after:block after:top-[6px] after:w-[3px] after:left-[7px] after:right-[7px] after:h-[6px] after:rotate-45 after:border-r-2 after:border-b-2 after:border-l-0 after:border-t-0',
    listitemUnchecked:
      'relative mx-2 px-6 list-none outline-none before:content-[""] before:w-4 before:h-4 before:top-0.5 before:left-0 before:cursor-pointer before:block before:bg-cover before:absolute before:border before:border-primary before:rounded',
    nested: {
      listitem: 'list-none before:hidden after:hidden',
    },
    ol: 'my-6 ml-6 list-decimal [&>li]:mt-2',
    olDepth: [
      'list-outside list-decimal!',
      'list-outside list-[upper-roman]!',
      'list-outside list-[lower-roman]!',
      'list-outside list-[upper-alpha]!',
      'list-outside list-[lower-alpha]!',
    ],
    ul: 'm-0 p-0 list-outside',
  },
  hashtag: 'text-blue-600 bg-blue-100 rounded-md px-1',
  text: {
    bold: 'font-bold',
    code: 'bg-gray-100 p-1 rounded-md',
    italic: 'italic',
    strikethrough: 'line-through',
    subscript: 'sub',
    superscript: 'sup',
    underline: 'underline',
    underlineStrikethrough: 'underline line-through',
  },
  image: 'relative inline-block user-select-none cursor-default editor-image',
  inlineImage:
    'relative inline-block user-select-none cursor-default inline-editor-image',
  keyword: 'text-purple-900 font-bold',
  code: 'PencilSimpleorTheme__code',
  codeHighlight: {
    atrule: 'PencilSimpleorTheme__tokenAttr',
    attr: 'PencilSimpleorTheme__tokenAttr',
    boolean: 'PencilSimpleorTheme__tokenProperty',
    builtin: 'PencilSimpleorTheme__tokenSelector',
    cdata: 'PencilSimpleorTheme__tokenComment',
    char: 'PencilSimpleorTheme__tokenSelector',
    class: 'PencilSimpleorTheme__tokenFunction',
    'class-name': 'PencilSimpleorTheme__tokenFunction',
    comment: 'PencilSimpleorTheme__tokenComment',
    constant: 'PencilSimpleorTheme__tokenProperty',
    deleted: 'PencilSimpleorTheme__tokenProperty',
    doctype: 'PencilSimpleorTheme__tokenComment',
    entity: 'PencilSimpleorTheme__tokenOperator',
    function: 'PencilSimpleorTheme__tokenFunction',
    important: 'PencilSimpleorTheme__tokenVariable',
    inserted: 'PencilSimpleorTheme__tokenSelector',
    keyword: 'PencilSimpleorTheme__tokenAttr',
    namespace: 'PencilSimpleorTheme__tokenVariable',
    number: 'PencilSimpleorTheme__tokenProperty',
    operator: 'PencilSimpleorTheme__tokenOperator',
    prolog: 'PencilSimpleorTheme__tokenComment',
    property: 'PencilSimpleorTheme__tokenProperty',
    punctuation: 'PencilSimpleorTheme__tokenPunctuation',
    regex: 'PencilSimpleorTheme__tokenVariable',
    selector: 'PencilSimpleorTheme__tokenSelector',
    string: 'PencilSimpleorTheme__tokenSelector',
    symbol: 'PencilSimpleorTheme__tokenProperty',
    tag: 'PencilSimpleorTheme__tokenProperty',
    url: 'PencilSimpleorTheme__tokenOperator',
    variable: 'PencilSimpleorTheme__tokenVariable',
  },
  characterLimit: 'bg-destructive/50!',
  table: 'PencilSimpleorTheme__table w-fit overflow-scroll border-collapse',
  tableCell:
    'PencilSimpleorTheme__tableCell w-24 relative border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"',
  tableCellActionButton:
    'PencilSimpleorTheme__tableCellActionButton bg-background block border-0 rounded-2xl w-5 h-5 text-foreground cursor-pointer',
  tableCellActionButtonContainer:
    'PencilSimpleorTheme__tableCellActionButtonContainer block right-1 top-1.5 absolute z-10 w-5 h-5',
  tableCellPencilSimpleing: 'PencilSimpleorTheme__tableCellPencilSimpleing rounded-sm shadow-sm',
  tableCellHeader:
    'PencilSimpleorTheme__tableCellHeader bg-muted border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
  tableCellPrimarySelected:
    'PencilSimpleorTheme__tableCellPrimarySelected border border-primary border-solid block h-[calc(100%-2px)] w-[calc(100%-2px)] absolute -left-px -top-px z-10 ',
  tableCellResizer:
    'PencilSimpleorTheme__tableCellResizer absolute -right-1 h-full w-2 cursor-ew-resize z-10 top-0',
  tableCellSelected: 'PencilSimpleorTheme__tableCellSelected bg-muted',
  tableCellSortedIndicator:
    'PencilSimpleorTheme__tableCellSortedIndicator block opacity-50 bsolute bottom-0 left-0 w-full h-1 bg-muted',
  tableResizeRuler:
    'PencilSimpleorTheme__tableCellResizeRuler block absolute w-px h-full bg-primary top-0',
  tableRowStriping:
    'PencilSimpleorTheme__tableRowStriping m-0 border-t p-0 even:bg-muted',
  tableSelected: 'PencilSimpleorTheme__tableSelected ring-2 ring-primary ring-offset-2',
  tableSelection: 'PencilSimpleorTheme__tableSelection bg-transparent',
  layoutItem: 'border border-dashed px-4 py-2',
  layoutContainer: 'grid gap-2.5 my-2.5 mx-0',
  autocomplete: 'text-muted-foreground',
  blockCursor: '',
  embedBlock: {
    base: 'user-select-none',
    focus: 'ring-2 ring-primary ring-offset-2',
  },
  hr: 'p-0.5 border-none my-1 mx-0 cursor-pointer after:content-[""] after:block after:h-0.5 after:bg-muted selected:ring-2 selected:ring-primary selected:ring-offset-2 selected:user-select-none',
  indent: '[--lexical-indent-base-value:40px]',
  mark: '',
  markOverlap: '',
}
