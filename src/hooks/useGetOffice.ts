import { useQuery } from '@tanstack/react-query'
import { TListMasterOffice } from 'src/types'

const useGetOffice = () => {
  const queries = useQuery<Array<TListMasterOffice>>({
    queryKey: ['MASTER-OFFICE'],
    queryFn: () => {
      const response = fetch('https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterOffice').then(res =>
        res.json()
      )

      return response
    }
  })

  return queries
}

export default useGetOffice
