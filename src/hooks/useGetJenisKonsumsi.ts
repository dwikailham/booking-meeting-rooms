import { useQuery } from '@tanstack/react-query'
import { TListMasterJenisKonsumsi } from 'src/types'

const useGetJenisKonsumsi = () => {
  const queries = useQuery<Array<TListMasterJenisKonsumsi>>({
    queryKey: ['MASTER-JENIS-KONSUMSI'],
    queryFn: () => {
      const response = fetch('https://6686cb5583c983911b03a7f3.mockapi.io/api/dummy-data/masterJenisKonsumsi').then(
        res => res.json()
      )

      return response
    }
  })

  return queries
}

export default useGetJenisKonsumsi
