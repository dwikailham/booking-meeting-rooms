// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import { FileOutline } from 'mdi-material-ui'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home'
    },
    {
      title: 'Ruang Meeting',
      icon: FileOutline,
      path: '/ruang-meeting'
    }
  ]
}

export default navigation
