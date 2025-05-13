import { useQuery } from '@tanstack/react-query'
import { TListMasterMeetingRooms } from 'src/types'

const useGetMeetingRooms = () => {
  const queries = useQuery<Array<TListMasterMeetingRooms>>({
    queryKey: ['MASTER-ROOMS'],
    queryFn: () => {
      const response = fetch('https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterMeetingRooms').then(
        res => res.json()
      )
      
      return response
    }
  })

  return queries
}

export default useGetMeetingRooms
