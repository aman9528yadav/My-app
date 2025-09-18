'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import RichTextEditorToolbar from './rich-text-editor-toolbar';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import 'highlight.js/styles/atom-one-dark.css';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

const RichTextEditor = ({
  value,
  onChange,
  className
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, 
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true, 
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Color,
      TextStyle,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          `prose dark:prose-invert prose-sm sm:prose-base m-5 focus:outline-none ${className || ''}`,
      },
    },
  });

  return (
    <div>
      <RichTextEditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
