import { Editor } from "@tiptap/react";
import {
  Bold, Strikethrough, Italic, Undo, Redo, Underline, Heading1, Heading2, Heading3, List, ListOrdered, Code2, CheckSquare,
  Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link2, Quote, Minus, Table as TableIcon,
  Columns2, Rows2, Trash2, ArrowUpFromLine, ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine, Palette, Pilcrow, ChevronDown
} from "lucide-react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCallback } from "react";
import { Toggle } from "./toggle";
import { ScrollArea, ScrollBar } from "./scroll-area";

const FONT_COLORS = [
  { name: 'Default', color: 'inherit' },
  { name: 'Black', color: '#000000' },
  { name: 'Red', color: '#E53E3E' },
  { name: 'Green', color: '#48BB78' },
  { name: 'Blue', color: '#4299E1' },
  { name: 'Purple', color: '#9F7AEA' },
];

const RichTextEditorToolbar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="p-1 flex flex-row items-center gap-1 flex-wrap">
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2">
              <span className="text-sm font-medium">Paragraph</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
              <Pilcrow className="w-4 h-4 mr-2" /> Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="w-4 h-4 mr-2" /> Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="w-4 h-4 mr-2" /> Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="w-4 h-4 mr-2" /> Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-6 border-l border-input mx-1" />

        {/* Basic Formatting */}
        <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("underline")} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
          <Underline className="w-4 h-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="w-4 h-4" />
        </Toggle>

        <div className="h-6 border-l border-input mx-1" />

        {/* Color Picker */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Palette className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {FONT_COLORS.map(({ name, color }) => (
                    <DropdownMenuItem
                        key={name}
                        onClick={() => editor.chain().focus().setColor(color).run()}
                        className={editor.isActive('textStyle', { color }) ? 'is-active' : ''}
                    >
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color === 'inherit' ? 'transparent' : color, border: '1px solid #ccc' }}></div>
                        {name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-6 border-l border-input mx-1" />

        {/* Lists */}
        <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("taskList")} onPressedChange={() => editor.chain().focus().toggleTaskList().run()}>
          <CheckSquare className="w-4 h-4" />
        </Toggle>

        <div className="h-6 border-l border-input mx-1" />
        
        {/* Insertables */}
        <Toggle size="sm" pressed={editor.isActive('link')} onPressedChange={setLink}>
          <Link2 className="w-4 h-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="w-4 h-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
        </Toggle>
        
        {/* Table Controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <TableIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
              Insert Table
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}><ArrowLeftFromLine className="w-4 h-4 mr-2" /> Add Column Before</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}><ArrowRightFromLine className="w-4 h-4 mr-2" /> Add Column After</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}><Trash2 className="w-4 h-4 mr-2" /> Delete Column</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}><ArrowUpFromLine className="w-4 h-4 mr-2" /> Add Row Before</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}><ArrowDownFromLine className="w-4 h-4 mr-2" /> Add Row After</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}><Trash2 className="w-4 h-4 mr-2" /> Delete Row</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}><Trash2 className="w-4 h-4 mr-2" /> Delete Table</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default RichTextEditorToolbar;
