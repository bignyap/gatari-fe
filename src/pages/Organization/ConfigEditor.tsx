import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent } from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import CommonButton from '../../components/Common/Button';

interface ConfigEditorProps {
  config: string;
  onConfigChange: (newConfig: string) => void;
  editorMode?: boolean;
  alwaysEditMode?: boolean;
  editorWidth?: string;
  editorHeight?: string;
  disabled?: boolean;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({
  config,
  onConfigChange,
  editorMode = false,
  alwaysEditMode = true,
  editorWidth = '100%',
  editorHeight = '300px',
  disabled = false,
}) => {
  const [isConfigEditMode, setIsConfigEditMode] = useState<boolean>(editorMode);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption(
        'readOnly',
        disabled || (!alwaysEditMode && !isConfigEditMode)
      );
    }
  }, [alwaysEditMode, isConfigEditMode, disabled]);

  return (
    <Card variant="outlined" sx={{ width: editorWidth }}>
      <CardContent>

        {/* Action Buttons */}
        {!disabled && !alwaysEditMode && (
          <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
            {!isConfigEditMode ? (
              <CommonButton
                label="Edit"
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsConfigEditMode(true)}
              />
            ) : (
              <>
                <CommonButton
                  label="Save"
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => setIsConfigEditMode(false)}
                />
                <CommonButton
                  label="Cancel"
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => setIsConfigEditMode(false)}
                />
              </>
            )}
          </Box>
        )}

        {/* Code Editor */}
        <Box
          sx={{
            width: '100%',
            minHeight: editorHeight,
            border: '1px solid #ccc',
            borderRadius: 1,
            backgroundColor: '#f7f9fa',
            overflow: 'hidden',
          }}
        >
          <CodeMirror
            value={config}
            options={{
              mode: 'text',
              lineNumbers: true,
              theme: 'default',
              readOnly: disabled || (!alwaysEditMode && !isConfigEditMode),
            }}
            onBeforeChange={(_, __, value) => {
              if (!disabled) onConfigChange(value);
            }}
            editorDidMount={(editor) => {
              editorRef.current = editor;
              editor.setSize('100%', editorHeight);

              const wrapper = editor.getWrapperElement();
              wrapper.style.backgroundColor = '#f7f9fa';
              wrapper.style.fontSize = '14px';
              wrapper.style.boxSizing = 'border-box';
              wrapper.style.borderRadius = '4px';
              wrapper.style.padding = '0';
              wrapper.style.textAlign = 'left';
              wrapper.style.margin = '0';

              const lines = wrapper.querySelector('.CodeMirror-lines') as HTMLElement;
              if (lines) {
                lines.style.paddingLeft = '8px';
                lines.style.margin = '0';
                lines.style.textAlign = 'left';
              }
              setTimeout(() => editor.refresh(), 0);
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConfigEditor;