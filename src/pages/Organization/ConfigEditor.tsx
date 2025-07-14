import React, { useEffect, useRef } from 'react';
import { Box, Card, CardContent, SxProps, Theme, useTheme } from '@mui/material';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css'; // ✅ Light theme
import 'codemirror/mode/javascript/javascript';

interface ConfigEditorProps {
  config: string;
  onConfigChange: (newConfig: string) => void;
  editorMode?: boolean;
  alwaysEditMode?: boolean;
  editorWidth?: string;
  editorHeight?: string;
  disabled?: boolean;
  cardSx?: SxProps<Theme>;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({
  config,
  onConfigChange,
  editorMode = false,
  alwaysEditMode = true,
  editorWidth = '100%',
  editorHeight = '300px',
  disabled = false,
  cardSx = {},
}) => {
  const editorRef = useRef<any>(null);
  const theme = useTheme();

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption(
        'readOnly',
        disabled || (!alwaysEditMode && !editorMode)
      );
    }
  }, [alwaysEditMode, editorMode, disabled]);

  return (
    <Card
      variant="outlined"
      sx={{
        width: editorWidth,
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        ...cardSx,
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: '100%',
            minHeight: editorHeight,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            backgroundColor: '#fefefe',
            overflow: 'hidden',
          }}
        >
          <CodeMirror
            value={config}
            options={{
              mode: 'javascript',
              theme: 'eclipse',
              lineNumbers: true,
              readOnly: disabled || (!alwaysEditMode && !editorMode),
            }}
            onBeforeChange={(_, __, value) => {
              if (!disabled) onConfigChange(value);
            }}
            editorDidMount={(editor) => {
              editorRef.current = editor;
              editor.setSize('100%', editorHeight);
            
              const wrapper = editor.getWrapperElement();
              wrapper.style.fontSize = '14px';
            
              // Style the gutters (line number section)
              const gutterContainer = wrapper.querySelector('.CodeMirror-gutters') as HTMLElement;
              if (gutterContainer) {
                gutterContainer.style.background = '#f9f9f9';
                gutterContainer.style.borderRight = '1px solid #e0e0e0';
                gutterContainer.style.paddingLeft = '6px';
                gutterContainer.style.paddingRight = '6px';
              }
            
              const gutters = wrapper.querySelectorAll('.CodeMirror-linenumber');
              gutters.forEach((gutter: Element) => {
                const el = gutter as HTMLElement;
                el.style.textAlign = 'right';
                el.style.paddingRight = '4px';
                el.style.color = '#999';
              });
            
              setTimeout(() => editor.refresh(), 0);
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConfigEditor;