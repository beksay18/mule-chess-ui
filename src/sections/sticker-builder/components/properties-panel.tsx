import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

import type { TextAlign, TextElement, ImageElement, ShapeElement } from '../types';
import type { StickerBuilderApi } from '../hooks/use-sticker-builder';

import { FONT_FAMILIES, DEFAULT_COLORS } from '../constants';

type PropertiesPanelProps = {
    api: StickerBuilderApi;
};

export function PropertiesPanel({ api }: PropertiesPanelProps) {
    const { selected, updateSelected, stripBackground } = api;

    if (!selected) {
        return (
            <Typography variant="body2" color="text.secondary">
                Select an element on the canvas to edit its properties.
            </Typography>
        );
    }

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={700}>
                {selected.type === 'text' ? 'Text' : selected.name}
            </Typography>

            {selected.locked && (
                <Typography variant="caption" color="warning.main">
                    This layer is locked. Unlock it to edit.
                </Typography>
            )}

            {selected.type === 'text' && (
                <TextControls element={selected} disabled={selected.locked} onChange={updateSelected} />
            )}

            {selected.type === 'image' && (
                <ImageControls
                    element={selected}
                    disabled={selected.locked}
                    onChange={updateSelected}
                    onRemoveBackground={() => void stripBackground()}
                />
            )}

            {selected.type === 'shape' && (
                <ShapeControls element={selected} disabled={selected.locked} onChange={updateSelected} />
            )}

            {selected.type === 'icon' && (
                <ColorField
                    label="Icon color"
                    value={selected.color}
                    disabled={selected.locked}
                    onChange={(color) => updateSelected({ color })}
                />
            )}

            <SliderField
                label="Opacity"
                value={Math.round(selected.opacity * 100)}
                min={10}
                max={100}
                disabled={selected.locked}
                onChange={(value) => updateSelected({ opacity: value / 100 }, false)}
                onCommit={(value) => updateSelected({ opacity: value / 100 })}
            />

            <SliderField
                label="Rotation"
                value={selected.rotation}
                min={-180}
                max={180}
                disabled={selected.locked}
                onChange={(value) => updateSelected({ rotation: value }, false)}
                onCommit={(value) => updateSelected({ rotation: value })}
            />
        </Stack>
    );
}

function TextControls({
    element,
    disabled,
    onChange,
}: {
    element: TextElement;
    disabled: boolean;
    onChange: StickerBuilderApi['updateSelected'];
}) {
    return (
        <>
            <TextField
                size="small"
                label="Text"
                value={element.content}
                disabled={disabled}
                onChange={(event) => onChange({ content: event.target.value })}
            />
            <TextField
                select
                size="small"
                label="Font"
                value={element.fontFamily}
                disabled={disabled}
                onChange={(event) => onChange({ fontFamily: event.target.value })}
            >
                {FONT_FAMILIES.map((font) => (
                    <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                        {font}
                    </MenuItem>
                ))}
            </TextField>
            <SliderField
                label="Size"
                value={element.fontSize}
                min={16}
                max={160}
                disabled={disabled}
                onChange={(value) => onChange({ fontSize: value }, false)}
                onCommit={(value) => onChange({ fontSize: value })}
            />
            <ToggleButtonGroup size="small" exclusive={false} disabled={disabled}>
                <ToggleButton
                    value="bold"
                    selected={element.fontWeight === 'bold'}
                    onClick={() => onChange({ fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })}
                >
                    <FormatBoldIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                    value="italic"
                    selected={element.fontStyle === 'italic'}
                    onClick={() => onChange({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
                >
                    <FormatItalicIcon fontSize="small" />
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                size="small"
                exclusive
                value={element.textAlign}
                disabled={disabled}
                onChange={(_, value: TextAlign | null) => {
                    if (value) onChange({ textAlign: value });
                }}
            >
                <ToggleButton value="left">
                    <FormatAlignLeftIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="center">
                    <FormatAlignCenterIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="right">
                    <FormatAlignRightIcon fontSize="small" />
                </ToggleButton>
            </ToggleButtonGroup>
            <ColorField
                label="Color"
                value={element.color}
                disabled={disabled}
                onChange={(color) => onChange({ color })}
            />
            <SliderField
                label="Letter spacing"
                value={element.letterSpacing}
                min={-4}
                max={24}
                disabled={disabled}
                onChange={(value) => onChange({ letterSpacing: value }, false)}
                onCommit={(value) => onChange({ letterSpacing: value })}
            />
            <SliderField
                label="Outline"
                value={element.outlineWidth}
                min={0}
                max={12}
                disabled={disabled}
                onChange={(value) => onChange({ outlineWidth: value }, false)}
                onCommit={(value) => onChange({ outlineWidth: value })}
            />
            {element.outlineWidth > 0 && (
                <ColorField
                    label="Outline color"
                    value={element.outlineColor}
                    disabled={disabled}
                    onChange={(color) => onChange({ outlineColor: color })}
                />
            )}
            <SliderField
                label="Curve"
                value={element.curve}
                min={-80}
                max={80}
                disabled={disabled}
                onChange={(value) => onChange({ curve: value }, false)}
                onCommit={(value) => onChange({ curve: value })}
            />
        </>
    );
}

function ImageControls({
    element,
    disabled,
    onChange,
    onRemoveBackground,
}: {
    element: ImageElement;
    disabled: boolean;
    onChange: StickerBuilderApi['updateSelected'];
    onRemoveBackground: () => void;
}) {
    return (
        <>
            <Button
                size="small"
                variant="outlined"
                disabled={disabled}
                onClick={onRemoveBackground}
                sx={{ textTransform: 'none' }}
            >
                {element.backgroundRemoved ? 'Background removed' : 'Remove background'}
            </Button>
            <SliderField
                label="Crop top"
                value={Math.round(element.crop.top * 100)}
                min={0}
                max={40}
                disabled={disabled}
                onChange={(value) => onChange({ crop: { ...element.crop, top: value / 100 } }, false)}
                onCommit={(value) => onChange({ crop: { ...element.crop, top: value / 100 } })}
            />
            <SliderField
                label="Crop bottom"
                value={Math.round(element.crop.bottom * 100)}
                min={0}
                max={40}
                disabled={disabled}
                onChange={(value) => onChange({ crop: { ...element.crop, bottom: value / 100 } }, false)}
                onCommit={(value) => onChange({ crop: { ...element.crop, bottom: value / 100 } })}
            />
            <SliderField
                label="Crop left"
                value={Math.round(element.crop.left * 100)}
                min={0}
                max={40}
                disabled={disabled}
                onChange={(value) => onChange({ crop: { ...element.crop, left: value / 100 } }, false)}
                onCommit={(value) => onChange({ crop: { ...element.crop, left: value / 100 } })}
            />
            <SliderField
                label="Crop right"
                value={Math.round(element.crop.right * 100)}
                min={0}
                max={40}
                disabled={disabled}
                onChange={(value) => onChange({ crop: { ...element.crop, right: value / 100 } }, false)}
                onCommit={(value) => onChange({ crop: { ...element.crop, right: value / 100 } })}
            />
            <SliderField
                label="Outline"
                value={element.outlineWidth}
                min={0}
                max={16}
                disabled={disabled}
                onChange={(value) => onChange({ outlineWidth: value }, false)}
                onCommit={(value) => onChange({ outlineWidth: value })}
            />
            {element.outlineWidth > 0 && (
                <ColorField
                    label="Outline color"
                    value={element.outlineColor}
                    disabled={disabled}
                    onChange={(color) => onChange({ outlineColor: color })}
                />
            )}
        </>
    );
}

function ShapeControls({
    element,
    disabled,
    onChange,
}: {
    element: ShapeElement;
    disabled: boolean;
    onChange: StickerBuilderApi['updateSelected'];
}) {
    return (
        <>
            <ColorField label="Fill" value={element.fill} disabled={disabled} onChange={(fill) => onChange({ fill })} />
            <ColorField
                label="Stroke"
                value={element.stroke}
                disabled={disabled}
                onChange={(stroke) => onChange({ stroke })}
            />
            <SliderField
                label="Stroke width"
                value={element.strokeWidth}
                min={0}
                max={20}
                disabled={disabled}
                onChange={(value) => onChange({ strokeWidth: value }, false)}
                onCommit={(value) => onChange({ strokeWidth: value })}
            />
        </>
    );
}

function ColorField({
    label,
    value,
    disabled,
    onChange,
}: {
    label: string;
    value: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box
                    component="input"
                    type="color"
                    value={value}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.value)}
                    sx={{ width: 36, height: 32, border: 0, bgcolor: 'transparent', p: 0 }}
                />
                {DEFAULT_COLORS.map((color) => (
                    <Box
                        key={color}
                        onClick={() => {
                            if (!disabled) onChange(color);
                        }}
                        sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            bgcolor: color,
                            border: '1px solid #d1d5db',
                            cursor: disabled ? 'default' : 'pointer',
                        }}
                    />
                ))}
            </Stack>
        </Stack>
    );
}

function SliderField({
    label,
    value,
    min,
    max,
    disabled,
    onChange,
    onCommit,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    disabled?: boolean;
    onChange: (value: number) => void;
    onCommit: (value: number) => void;
}) {
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="caption">{value}</Typography>
            </Stack>
            <Slider
                size="small"
                value={value}
                min={min}
                max={max}
                disabled={disabled}
                onChange={(_, next) => onChange(Number(next))}
                onChangeCommitted={(_, next) => onCommit(Number(next))}
            />
        </Box>
    );
}
