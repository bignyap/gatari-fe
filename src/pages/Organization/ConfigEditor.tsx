import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
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
  editorHeight = '300px', // Use a sensible default height
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
    <Box sx={{ width: '100%' }}>
      {!disabled && !alwaysEditMode && !isConfigEditMode && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <CommonButton
            label="Edit"
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setIsConfigEditMode(true)}
          />
        </Box>
      )}

      {!disabled && !alwaysEditMode && isConfigEditMode && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
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
            sx={{ ml: 2 }}
            onClick={() => setIsConfigEditMode(false)}
          />
        </Box>
      )}

      {/* Parent must define sizing for Codemirror to respect */}
      <Box sx={{ width: '100%', maxWidth: '100%' }}>
        <CodeMirror
          value={config}
          options={{
            mode: 'text',
            lineNumbers: true,
            theme: 'default',
            readOnly: disabled || (!alwaysEditMode && !isConfigEditMode),
          }}
          onBeforeChange={(editor, data, value) => {
            if (!disabled) onConfigChange(value);
          }}
          editorDidMount={(editor) => {
            editorRef.current = editor;

            editor.setSize('100%', editorHeight); // force full width, fixed height

            const wrapper = editor.getWrapperElement();
            wrapper.style.width = '100%';
            wrapper.style.minHeight = editorHeight;
            wrapper.style.maxWidth = '100%';
            wrapper.style.textAlign = 'left';
            wrapper.style.backgroundColor = '#f0f0f0';
            wrapper.style.fontSize = '16px';

            // Refresh after DOM mount
            setTimeout(() => editor.refresh(), 0);
          }}
        />
      </Box>
    </Box>
  );
};

export default ConfigEditor;