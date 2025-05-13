export type TListMasterOffice = {
  createdAt: string
  officeName: string
  id: string
}

export type TListMasterMeetingRooms = {
  createdAt: string
  officeId: string
  officeName: string
  roomName: string
  capacity: number
  id: string
}

export type TListMasterJenisKonsumsi = {
  createdAt: string
  name: string
  maxPrice: number
  id: string
}

export type TListHour = {
  code: number
  label: string
}

export type TListMeetingRoom = {
  date: string
  endTime: string
  startTime: string
  jumlahPeserta: string
  meetingRooms: string
  office: string
}
