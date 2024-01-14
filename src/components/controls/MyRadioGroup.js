//
//  Libraries
//
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'
//=====================================================================================
export default function MyRadioGroup(props) {
  const {
    name,
    label,
    value,
    onChange,
    items,
    colorFormLabel = 'blue',
    colorRadioButton = 'blue',
    colorRadioText = 'blue',
    styleFormLabel = 'subtitle2',
    size = 'medium',
    ...other
  } = props

  return (
    <FormControl>
      <FormLabel sx={{ color: colorFormLabel, typography: styleFormLabel }}>{label}</FormLabel>
      <RadioGroup name={name} value={value} onChange={onChange}>
        {items.map(item => (
          <FormControlLabel
            key={item.id}
            value={item.id}
            control={<Radio sx={{ marginLeft: '16px', color: colorRadioButton }} size={size} />}
            label={item.title}
            sx={{ color: colorRadioText }}
            {...other}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
