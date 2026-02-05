"use client";
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon, 
  Eraser 
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor = ({ value, onChange, placeholder, rows = 4 }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "rich-text-link",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-text-editor-content",
        style: `min-height: ${rows * 25}px; height: auto;`,
        "data-placeholder": placeholder || "",
      },
    },
    immediatelyRender: false, // Fix SSR hydration mismatch
  });

  // Update editor content when value prop changes externally
  if (editor && editor.getHTML() !== value) {
    editor.commands.setContent(value);
  }

  return (
    <div className="rich-text-editor-wrapper">
      <div className="rich-text-toolbar">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor?.isActive("heading", { level: 1 }) ? "is-active" : ""}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor?.isActive("heading", { level: 2 }) ? "is-active" : ""}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor?.isActive("heading", { level: 3 }) ? "is-active" : ""}
          title="Heading 3"
        >
          H3
        </button>
        <div className="toolbar-divider" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "is-active" : ""}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "is-active" : ""}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive("underline") ? "is-active" : ""}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={editor?.isActive("strike") ? "is-active" : ""}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <div className="toolbar-divider" />
        {/* <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive("bulletList") ? "is-active" : ""}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive("orderedList") ? "is-active" : ""}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button> */}
        <div className="toolbar-divider" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={editor?.isActive({ textAlign: "left" }) ? "is-active" : ""}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={editor?.isActive({ textAlign: "center" }) ? "is-active" : ""}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={editor?.isActive({ textAlign: "right" }) ? "is-active" : ""}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        {/* <div className="toolbar-divider" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) {
              editor?.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={editor?.isActive("link") ? "is-active" : ""}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button> */}
        <input
          type="color"
          onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
          title="Text Color"
          className="color-picker"
        />
        <input
          type="color"
          onChange={(e) => {
            if (editor?.isActive("highlight")) {
              editor.chain().focus().unsetHighlight().run();
            }
            editor?.chain().focus().toggleHighlight({ color: e.target.value }).run();
          }}
          title="Background Color"
          className="color-picker"
        />
        {/* <div className="toolbar-divider" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          <Eraser className="h-4 w-4" />
        </button> */}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
