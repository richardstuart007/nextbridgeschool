//
//  Sub Components
//
import MyButton from './MyButton'

//=====================================================================================
export default function MyActionButton(props) {
  const { color, children, onClick, ...other } = props

  return (
    <MyButton
      sx={{
        ':hover': {
          bgcolor: 'yellow'
        }
      }}
      onClick={onClick}
      {...other}
    >
      {children}
    </MyButton>
  )
}
