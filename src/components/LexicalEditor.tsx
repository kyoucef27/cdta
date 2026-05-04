import React, { useEffect, useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $setBlocksType } from '@lexical/selection';
import { 
  $getRoot, 
  $getSelection, 
  $insertNodes, 
  $createParagraphNode, 
  $createTextNode,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND
} from 'lexical';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode, $createHeadingNode } from '@lexical/rich-text';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
  },
};

// Plugin to handle initial HTML and sync changes back
function HtmlPlugin({ initialHtml, onChange }: { initialHtml: string, onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const currentHtml = $generateHtmlFromNodes(editor);
      // Only update if editor is effectively empty and we have initial content
      const isEmpty = currentHtml === '<p class="editor-paragraph"><span><br></span></p>' || 
                      currentHtml === '<p class="editor-paragraph"><br></p>' ||
                      currentHtml === '';
                      
      if (initialHtml && currentHtml !== initialHtml && isEmpty) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, 'text/html');
        
        // Use the native Lexical way to import from DOM
        // We'll try to get it from the window/global if it's there or just use the import
        const root = $getRoot();
        root.clear();
        
        try {
          // Use the correct API for recent Lexical versions
          const nodes = $generateNodesFromDOM(editor, dom);
          root.append(...nodes);
        } catch (e) {
          console.warn('Lexical HTML import failed, trying fallback', e);
          // Very basic fallback: just put text if it fails
          const text = parser.body.textContent || '';
          const paragraph = $createParagraphNode();
          const textNode = $createTextNode(text);
          paragraph.append(textNode);
          root.append(paragraph);
        }
      }
    });
  }, [editor, initialHtml]);

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor);
          onChange(html);
        });
      }}
    />
  );
}



function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  const formatUnderline = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  const formatHeading = (headingSize: 'h1' | 'h2') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  return (
    <div style={{
      display: 'flex', gap: 6, padding: '8px 12px', borderBottom: '1px solid #e2e8f0',
      background: '#f8fafc', borderRadius: '10px 10px 0 0', flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <ToolbarButton onClick={undo} label="⟲" title="Undo" />
      <ToolbarButton onClick={redo} label="⟳" title="Redo" />
      <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 4px' }} />
      
      <ToolbarButton onClick={formatParagraph} label="¶" title="Paragraph" />
      <ToolbarButton onClick={() => formatHeading('h1')} label="H1" title="Heading 1" />
      <ToolbarButton onClick={() => formatHeading('h2')} label="H2" title="Heading 2" />
      
      <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 4px' }} />
      <ToolbarButton onClick={formatBold} label="B" bold title="Bold" />
      <ToolbarButton onClick={formatItalic} label="I" italic title="Italic" />
      <ToolbarButton onClick={formatUnderline} label="U" underline title="Underline" />
    </div>
  );
}

function ToolbarButton({ onClick, label, bold, italic, underline, title }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: '0 8px', height: 32, minWidth: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer',
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
        fontSize: 13,
        color: '#475569',
        transition: 'all 0.2s'
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      {label}
    </button>
  );
}

export function LexicalEditor({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder?: string }) {
  const initialConfig = {
    namespace: 'CDTAEditor',
    theme,
    onError: (error: Error) => console.error(error),
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
  };

  return (
    <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div style={{ position: 'relative', background: '#fff', minHeight: 200 }}>
          <RichTextPlugin
            contentEditable={<ContentEditable style={{
              minHeight: 200, padding: '12px 16px', outline: 'none',
              fontFamily: 'system-ui, sans-serif', fontSize: 15, lineHeight: 1.6
            }} />}
            placeholder={<div style={{
              position: 'absolute', top: 12, left: 16, color: '#94a3b8',
              pointerEvents: 'none', fontSize: 15
            }}>{placeholder || 'Start typing...'}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <HtmlPlugin initialHtml={value} onChange={onChange} />
        </div>
      </LexicalComposer>

      <style>{`
        .editor-paragraph { margin: 0 0 8px; }
        .editor-text-bold { font-weight: bold; }
        .editor-text-italic { font-style: italic; }
        .editor-text-underline { text-decoration: underline; }
      `}</style>
    </div>
  );
}
