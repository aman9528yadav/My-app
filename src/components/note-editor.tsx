

"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save, Trash2, Bold, Italic, List, Underline, Strikethrough, Link2, ListOrdered, Code2, Paperclip, Smile, Image as ImageIcon, X, Undo, Redo, Palette, CaseSensitive, Pilcrow, Heading1, Heading2, Text, Circle, CalculatorIcon, ArrowRightLeft, CheckSquare, Baseline, Highlighter, File, Lock, Unlock, KeyRound, Share2, FileText, Download, Notebook, Star, Tag, BookCopy, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Note } from './notepad';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from '@/context/language-context';
import { listenToUserNotes, updateUserNotes, listenToUserData, UserData, getGuestKey, updateUserData } from '@/services/firestore';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import RichTextEditorToolbar from './ui/rich-text-editor-toolbar';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapUnderline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import TiptapLink from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';


const FONT_COLORS = [
  { name: 'Default', color: 'inherit' },
  { name: 'Black', color: '#000000' },
  { name: 'Red', color: '#E53E3E' },
  { name: 'Green', color: '#48BB78' },
  { name: 'Blue', color: '#4299E1' },
  { name: 'Purple', color: '#9F7AEA' },
];

interface UserProfile {
    fullName: string;
    email: string;
    [key:string]: any;
}


export function NoteEditor({ noteId }: { noteId: string }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [attachment, setAttachment] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [customFontSize, setCustomFontSize] = useState('16');
    const [isDirty, setIsDirty] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const { t } = useLanguage();
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [showSetPasswordDialog, setShowSetPasswordDialog] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isExportLocked, setIsExportLocked] = useState(true);
    const [showPremiumLockDialog, setShowPremiumLockDialog] = useState(false);
    const [backgroundStyle, setBackgroundStyle] = useState<'none' | 'lines' | 'dots' | 'grid'>('none');
    const [showSaveDialog, setShowSaveDialog] = useState(false);


    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isNewNote = noteId === 'new';
    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            TiptapUnderline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TiptapLink.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
            setIsDirty(true);
        },
        editorProps: {
            attributes: {
                class: `prose dark:prose-invert prose-sm sm:prose-base m-5 focus:outline-none flex-grow ${backgroundStyle ? `note-bg-${backgroundStyle}` : ''}`,
            },
        },
    });

    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        setIsClient(true);
        const storedProfile = localStorage.getItem('userProfile');
        const userEmail = storedProfile ? JSON.parse(storedProfile).email : null;
        setProfile(userEmail ? { email: userEmail } : null);

        if (!userEmail) { // Guest user
            const localNotes = localStorage.getItem(getGuestKey('notes'));
            setAllNotes(localNotes ? JSON.parse(localNotes) : []);
            setIsExportLocked(true);
        }

    }, []);

    useEffect(() => {
        const userEmail = profile?.email || null;

        if (!userEmail) {
             if (!isNewNote) {
                const noteToEdit = allNotes.find(note => note.id === noteId);
                if (noteToEdit) {
                    setTitle(noteToEdit.title);
                    setContent(noteToEdit.content);
                    setIsFavorite(noteToEdit.isFavorite || false);
                    setCategory(noteToEdit.category || '');
                    setAttachment(noteToEdit.attachment || null);
                    setIsLocked(noteToEdit.isLocked || false);
                    setBackgroundStyle(noteToEdit.backgroundStyle || 'none');
                }
            }
            return;
        }
        
        const unsubNotes = listenToUserNotes(userEmail, (notesFromDb) => {
            setAllNotes(notesFromDb);
            if (!isNewNote) {
                const noteToEdit = notesFromDb.find(note => note.id === noteId);
                if (noteToEdit) {
                    setTitle(noteToEdit.title);
                    setContent(noteToEdit.content);
                    setIsFavorite(noteToEdit.isFavorite || false);
                    setCategory(noteToEdit.category || '');
                    setAttachment(noteToEdit.attachment || null);
                    setIsLocked(noteToEdit.isLocked || false);
                    setBackgroundStyle(noteToEdit.backgroundStyle || 'none');
                } else {
                    toast({ title: t('noteEditor.toast.notFound'), variant: "destructive" });
                    router.push('/notes');
                }
            }
        });

        const unsubUserData = listenToUserData(userEmail, (data) => {
            setUserData(data);
            const isPremium = data?.settings?.isPremium || false; // Assume a premium flag
            setIsExportLocked(!isPremium && data?.email !== "amanyadavyadav9458@gmail.com");
        });
        
        return () => {
            unsubNotes();
            unsubUserData();
        };

    }, [isNewNote, noteId, router, toast, profile, t, allNotes]);


     useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; // Required for legacy browsers
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    const handleLockToggle = () => {
        if (!isLocked && !userData?.notePassword) {
            setShowSetPasswordDialog(true);
        } else {
            setIsLocked(!isLocked);
            setIsDirty(true);
        }
    }
    
    const handleSetInitialPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            toast({ title: "Passwords do not match", variant: "destructive" });
            return;
        }
        if (newPassword.length < 4) {
            toast({ title: "Password must be at least 4 characters", variant: "destructive" });
            return;
        }
        if (profile?.email) {
            await updateUserNotes(profile.email, allNotes); // Save other changes first
            await updateUserData(profile.email, { notePassword: newPassword });
            setIsLocked(true);
            setIsDirty(true);
            setShowSetPasswordDialog(false);
            setNewPassword('');
            setConfirmNewPassword('');
            toast({ title: "Password Set & Note Locked", description: "You can change this password in settings." });
        }
    };


    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                const fileInfo = `${file.name}|${result}`;
                setAttachment(fileInfo);
                toast({ title: "File attached successfully!"});
                setIsDirty(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setAttachment(null);
        toast({ title: t('noteEditor.toast.imageRemoved')});
        setIsDirty(true);
    }
    
    const showComingSoonToast = () => {
        toast({ title: t('noteEditor.toast.comingSoon.title'), description: t('noteEditor.toast.comingSoon.description')});
    }
    
    const handleOpenSaveDialog = () => {
         if (!editor?.getText().trim()) {
            toast({
                title: "Cannot save empty note",
                description: "Please add some content before saving.",
                variant: "destructive"
            });
            return;
        }
        setShowSaveDialog(true);
    }


    const handleSave = () => {
        const finalTitle = title.trim() || 'Untitled Note';

        const notes: Note[] = [...allNotes];
        const now = new Date().toISOString();

        if (isNewNote) {
            const newNote: Note = {
                id: uuidv4(),
                title: finalTitle,
                content: content,
                isFavorite: isFavorite || false,
                category: category || '',
                attachment: attachment || null,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                isLocked,
                backgroundStyle,
            };
            notes.push(newNote);
        } else {
            const noteIndex = notes.findIndex(note => note.id === noteId);
            if (noteIndex > -1) {
                notes[noteIndex] = {
                    ...notes[noteIndex],
                    title: finalTitle,
                    content: content,
                    isFavorite: isFavorite || false,
                    category: category || '',
                    attachment: attachment || null,
                    updatedAt: now,
                    isLocked,
                    backgroundStyle,
                };
            }
        }
        
        updateUserNotes(profile?.email || null, notes);

        const lastNoteString = `${title || 'Untitled Note'}|${new Date().toISOString()}`;
        localStorage.setItem('lastNote', lastNoteString);
        window.dispatchEvent(new StorageEvent('storage', { key: 'lastNote', newValue: lastNoteString }));
        setIsDirty(false);

        toast({
            title: t('noteEditor.toast.saved.title'),
            description: t('noteEditor.toast.saved.description'),
        });
        setShowSaveDialog(false);
        router.push('/notes');
    };
    
    const handleSoftDelete = () => {
        if (isNewNote) {
             router.push('/notes');
             return;
        };
        const updatedNotes = allNotes.map(note => 
            note.id === noteId ? { ...note, deletedAt: new Date().toISOString() } : note
        );
        
        updateUserNotes(profile?.email || null, updatedNotes);
        setIsDirty(false);
        toast({ title: t('notepad.toast.movedToTrash') });
        router.push('/notes');
    };

    const handleBack = () => {
        if (isDirty) {
            setShowUnsavedDialog(true);
        } else {
            router.back();
        }
    };
    
    const handleExport = async (type: 'png' | 'pdf' | 'txt') => {
        if (isExportLocked) {
            setShowPremiumLockDialog(true);
            return;
        }

        const contentEl = document.querySelector('.ProseMirror');
        if (!contentEl) return;
        
        if (type === 'txt') {
            const textContent = (contentEl as HTMLElement).innerText || '';
            const noteString = `Title: ${title}\nCategory: ${category}\n\n${textContent}\n\nSutradhaar | Made by Aman Yadav`;
            const blob = new Blob([noteString], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title || 'note'}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast({ title: "Exported as TXT!" });
            return;
        }

        const exportContainer = document.createElement('div');
        const tempContent = contentEl.cloneNode(true) as HTMLElement;
        exportContainer.style.width = contentEl.scrollWidth + 'px';
        exportContainer.style.height = contentEl.scrollHeight + 'px';
        exportContainer.style.padding = '1rem';
        exportContainer.style.backgroundColor = 'white';
        exportContainer.style.color = 'black';
        exportContainer.appendChild(tempContent);
        
        const credit = document.createElement('p');
        credit.innerText = "Sutradhaar | Made by Aman Yadav";
        credit.style.textAlign = 'center';
        credit.style.fontSize = '12px';
        credit.style.color = '#888';
        credit.style.marginTop = '20px';
        exportContainer.appendChild(exportContainer);

        document.body.appendChild(exportContainer);

        try {
            const canvas = await html2canvas(exportContainer, {
                scale: 2,
                useCORS: true,
                width: exportContainer.scrollWidth,
                height: exportContainer.scrollHeight
            });

            if (type === 'png') {
                const image = canvas.toDataURL("image/png", 1.0);
                const link = document.createElement('a');
                link.href = image;
                link.download = `${title || 'note'}.png`;
                link.click();
                toast({ title: "Exported as Image!" });
            } else if (type === 'pdf') {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`${title || 'note'}.pdf`);
                toast({ title: "Exported as PDF!" });
            }
        } catch (error) {
            console.error('Export error:', error);
            toast({ title: "Could not export", variant: "destructive" });
        } finally {
            document.body.removeChild(exportContainer);
        }
    };
    
    const renderAttachment = () => {
        if (!attachment) return null;

        const parts = attachment.split('|');
        const fileName = parts[0];
        const dataUri = parts[1] || attachment;

        const isImage = dataUri.startsWith('data:image/');

        if (isImage) {
            return (
                 <div className="relative w-full h-64 my-4 group">
                    <Image src={dataUri} alt={t('notepad.attachmentAlt')} layout="fill" objectFit="contain" className="rounded-md" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleRemoveImage}>
                       <X size={16}/>
                    </Button>
                </div>
            )
        }

        return (
            <div className="relative group p-2 border rounded-lg my-4">
                 <a href={dataUri} download={fileName} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <File className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-foreground truncate font-medium">{fileName}</span>
                </a>
                 <Button variant="destructive" size="icon" className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleRemoveImage}>
                   <X size={14}/>
                </Button>
            </div>
        )
    }

    const existingCategories = [...new Set(allNotes.map(n => n.category).filter(Boolean))];


    if (!isClient && !isNewNote) {
        return null;
    }

    return (
        <div className="w-full max-w-md mx-auto flex flex-col h-screen">
            <header className="flex items-center justify-between p-4 flex-shrink-0 sticky top-0 z-50 bg-background">
                <Button variant="secondary" className="rounded-xl shadow-md" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                 <Input
                    id="note-title"
                    value={title}
                    onChange={(e) => {setTitle(e.target.value); setIsDirty(true);}}
                    placeholder="Untitled Note"
                    className="flex-1 mx-4 text-lg font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center"
                />
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleOpenSaveDialog}>
                        <Save />
                    </Button>
                </div>
            </header>
            
            <div className={cn("bg-card flex-grow flex flex-col gap-4 overflow-y-auto")}>
                 <EditorContent editor={editor} className="flex-grow flex flex-col"/>
            </div>

            {/* Bottom Toolbar */}
            <div className="flex-shrink-0 border-t bg-background p-1">
               <RichTextEditorToolbar editor={editor} />
                 <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            </div>

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Note</DialogTitle>
                        <DialogDescription>
                            Confirm details before saving your note.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                         <div className="space-y-2">
                            <Label htmlFor="note-title-final">Title</Label>
                            <Input
                                id="note-title-final"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Untitled Note"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="note-category">Category</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="note-category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g., Work, Personal"
                                />
                                {existingCategories.length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon"><Tag/></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {existingCategories.map(cat => (
                                                <DropdownMenuItem key={cat} onSelect={() => setCategory(cat)}>
                                                    {cat}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                             <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={cn(isFavorite && 'text-yellow-400')}
                            >
                                <Star className={cn(isFavorite && 'fill-yellow-400')}/>
                            </Button>
                            <Label htmlFor="favorite-switch">Mark as favorite</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Note</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('noteEditor.unsavedDialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('noteEditor.unsavedDialog.description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('noteEditor.unsavedDialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                setIsDirty(false); // Allow navigation now
                                router.back();
                            }}
                        >
                            {t('noteEditor.unsavedDialog.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog open={showSetPasswordDialog} onOpenChange={setShowSetPasswordDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Set Your Note Password</AlertDialogTitle>
                        <AlertDialogDescription>
                           This password will be used to lock and unlock your notes. You can change it later in settings.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                           <Label htmlFor="new-password">New Password</Label>
                           <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="confirm-password">Confirm Password</Label>
                           <Input id="confirm-password" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                        </div>
                         <Button variant="link" size="sm" className="h-auto p-0 justify-start" onClick={() => router.push('/forgot-password')}>Forgot password?</Button>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowSetPasswordDialog(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSetInitialPassword}>Set Password & Lock</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
             <AlertDialog open={showPremiumLockDialog} onOpenChange={setShowPremiumLockDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Premium Feature Locked</AlertDialogTitle>
                        <AlertDialogDescription>
                            This is a premium feature. Please upgrade to use it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push('/premium')}>
                            Go Premium
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


