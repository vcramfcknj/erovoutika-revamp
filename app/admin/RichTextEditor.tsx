'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEffect, useCallback, useState, type ReactNode } from 'react'
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Minus,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Unlink,
  Undo, Redo,
  RemoveFormatting,
} from 'lucide-react'

// ── Toolbar button ─────────────────────────────────────────────────────────────
function ToolBtn({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      disabled={disabled}
      title={title}
      className={`
        w-7 h-7 flex items-center justify-center rounded transition-all text-xs
        ${active
          ? 'bg-orange-500/20 text-orange-500 dark:bg-orange-500/25 dark:text-orange-400'
          : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-slate-200'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  )
}

// ── Toolbar divider ────────────────────────────────────────────────────────────
function Div() {
  return <span className="w-px h-5 bg-gray-200 dark:bg-white/[0.07] shrink-0 mx-0.5" />
}

// ── Main editor ────────────────────────────────────────────────────────────────
interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write the full article body here...',
  disabled = false,
  maxLength = 50000,
}: RichTextEditorProps) {
  // 1. Hydration state
  const [mounted, setMounted] = useState(false)

  // 2. Initialize Editor Hook (MUST be before any early returns)
  const editor = useEditor({
    immediatelyRender: false, // Prevents SSR mismatch
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount.configure({ limit: maxLength }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: 'tiptap-link' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none',
        spellcheck: 'true',
      },
    },
  })

  // 3. Effects
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync external value changes
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const incoming = value || ''
    const normalizedCurrent = current === '<p></p>' ? '' : current
    if (normalizedCurrent !== incoming) {
      editor.commands.setContent(incoming, false)
    }
  }, [value, editor])

  // Update editable state
  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [disabled, editor])

  // 4. Callbacks
  const setLink = useCallback(() => {
    if (!editor) return
    const previous = (editor.getAttributes('link').href as string) || ''
    const url = window.prompt('URL', previous)
    if (url === null) return

    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }, [editor])

  // 5. Conditional Returns (Safe to put here after all hooks)
  if (!mounted || !editor) return null

  const charCount = editor.storage.characterCount?.characters?.() ?? 0

  return (
    <div className={`
      flex flex-col rounded border transition-colors
      bg-white dark:bg-[#0a1020]
      border-gray-200 dark:border-white/[0.08]
      focus-within:border-orange-400 dark:focus-within:border-orange-500/60
      focus-within:ring-1 focus-within:ring-orange-400/20 dark:focus-within:ring-orange-500/15
      ${disabled ? 'opacity-60 pointer-events-none' : ''}
    `}>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-white/[0.02]">

        {/* History */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className="w-3.5 h-3.5" />
        </ToolBtn>

        <Div />

        {/* Headings */}
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <span className="font-bold text-[11px] leading-none">H2</span>
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <span className="font-bold text-[11px] leading-none">H3</span>
        </ToolBtn>

        <Div />

        {/* Inline marks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <Code className="w-3.5 h-3.5" />
        </ToolBtn>

        <Div />

        {/* Lists */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
          <span className="font-mono text-[10px] font-bold leading-none">{`</>`}</span>
        </ToolBtn>

        <Div />

        {/* Alignment */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
          <AlignRight className="w-3.5 h-3.5" />
        </ToolBtn>

        <Div />

        {/* Link */}
        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Insert link">
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} title="Remove link">
          <Unlink className="w-3.5 h-3.5" />
        </ToolBtn>

        <Div />

        {/* Divider line */}
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus className="w-3.5 h-3.5" />
        </ToolBtn>

        {/* Clear formatting */}
        <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear formatting">
          <RemoveFormatting className="w-3.5 h-3.5" />
        </ToolBtn>
      </div>

      {/* ── Editor area ── */}
      <EditorContent
        editor={editor}
        className="min-h-[260px] max-h-[520px] overflow-y-auto px-4 py-3 text-sm text-gray-800 dark:text-slate-200"
      />

      {/* ── Footer: char count ── */}
      <div className="flex items-center justify-end px-3 py-1.5 border-t border-gray-100 dark:border-white/[0.05]">
        <span
          className={`font-mono text-[10px] tabular-nums ${
            charCount > maxLength * 0.9
              ? 'text-orange-500'
              : 'text-gray-400 dark:text-slate-600'
          }`}
        >
          {charCount.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>

      <style>{`
        .tiptap-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .dark .tiptap-editor p.is-editor-empty:first-child::before {
          color: #475569;
        }
        .tiptap-editor h2 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.3; }
        .tiptap-editor h3 { font-size: 1.05rem; font-weight: 700; margin: 0.85rem 0 0.4rem; line-height: 1.3; }
        .tiptap-editor h4 { font-size: 0.95rem; font-weight: 600; margin: 0.75rem 0 0.35rem; }
        .tiptap-editor p { margin: 0 0 0.65rem; line-height: 1.75; }
        .tiptap-editor p:last-child { margin-bottom: 0; }
        .tiptap-editor ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0 0.75rem; }
        .tiptap-editor ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0 0.75rem; }
        .tiptap-editor li { margin-bottom: 0.2rem; line-height: 1.65; }
        .tiptap-editor li p { margin: 0; }
        .tiptap-editor blockquote {
          border-left: 3px solid #f97316;
          padding-left: 1rem;
          margin: 0.75rem 0;
          color: #6b7280;
          font-style: italic;
        }
        .dark .tiptap-editor blockquote { color: #94a3b8; border-left-color: #ea580c; }
        .tiptap-editor code {
          background: #f3f4f6;
          color: #ea580c;
          font-family: ui-monospace, monospace;
          font-size: 0.8em;
          padding: 0.1em 0.35em;
          border-radius: 3px;
        }
        .dark .tiptap-editor code { background: rgba(255,255,255,0.07); color: #fb923c; }
        .tiptap-editor pre {
          background: #1e293b;
          color: #e2e8f0;
          font-family: ui-monospace, monospace;
          font-size: 0.8rem;
          padding: 0.85rem 1rem;
          border-radius: 6px;
          margin: 0.75rem 0;
          overflow-x: auto;
        }
        .tiptap-editor pre code { background: none; color: inherit; padding: 0; font-size: inherit; }
        .tiptap-editor hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 1rem 0;
        }
        .dark .tiptap-editor hr { border-top-color: rgba(255,255,255,0.08); }
        .tiptap-link { color: #f97316; text-decoration: underline; text-underline-offset: 2px; }
        .tiptap-link:hover { color: #ea580c; }
        .tiptap-editor [style*="text-align: center"] { text-align: center; }
        .tiptap-editor [style*="text-align: right"]  { text-align: right; }
        .tiptap-editor [style*="text-align: left"]   { text-align: left; }
        .tiptap-editor ::selection { background: rgba(249,115,22,0.18); }
        .tiptap-editor:focus { outline: none; }
      `}</style>
    </div>
  )
}