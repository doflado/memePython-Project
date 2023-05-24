import { getEditorDefaults } from '@pqina/pintura';

const editorSettings = getEditorDefaults({
  cropSelectPresetOptions: [
    [undefined, 'Custom'],
    [1, 'Square'],

    // shown when cropSelectPresetFilter is set to 'landscape'
    [2 / 1, '2:1'],
    [3 / 2, '3:2'],
    [4 / 3, '4:3'],
    [16 / 10, '16:10'],
    [16 / 9, '16:9'],

    // shown when cropSelectPresetFilter is set to 'portrait'
    [1 / 2, '1:2'],
    [2 / 3, '2:3'],
    [3 / 4, '3:4'],
    [10 / 16, '10:16'],
    [9 / 16, '9:16'],
  ],
});

// reorganize utils and remove the ones we don't want
const fixedUtils = [
  'annotate',
  // 'decorate', // this is the same as annoatate really. Leaving it here in case we would want it back
  'finetune',
  'redact',
  'crop',
  'resize',
  'filter',
  'frame',
];

editorSettings.utils = fixedUtils;

export const EDITOR_CONFIG = editorSettings;
