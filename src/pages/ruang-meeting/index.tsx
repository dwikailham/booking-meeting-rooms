/** React Imports */
import { useMemo } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Add } from '@mui/icons-material'
import { Button, Stack, Breadcrumbs } from '@mui/material'
import { NavigateNext } from "@mui/icons-material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/** Next Imports */
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

/** Type Imports */
import { TListMeetingRoom } from 'src/types'

const breadcrumbs = [
  <Typography key='4' fontWeight='600'>
    Ruang Meeting
  </Typography>
]

const RuangMeetingPage = () => {
  const router = useRouter();

  const dataTable: Array<TListMeetingRoom> = useMemo(() => JSON.parse(window.localStorage.getItem('bookedMeetingRooms') || "[]"), [])
  console.log('DATA', dataTable)

  return (
    <Stack spacing={5}>
      <Breadcrumbs separator={<NavigateNext fontSize='small' />} aria-label='breadcrumb'>
        {breadcrumbs}
      </Breadcrumbs>

      <Card>
        <CardHeader title='Ruang Meeting'
          action={<Button
            variant='contained'
            startIcon={<Add />}
            onClick={() => router.push('/ruang-meeting/add')}
          >Pesan Ruangan</Button>}></CardHeader>
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Ruang Meeting</TableCell>
                  <TableCell align="right">Tanggal Rapat</TableCell>
                  <TableCell align="right">Waktu Pelaksanaan</TableCell>
                  <TableCell align="right">Jumlah Peserta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTable.map((row, idx) => (
                  <TableRow
                    key={row.date + idx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.office}
                    </TableCell>
                    <TableCell align="right">{row.meetingRooms}</TableCell>
                    <TableCell align="right">{dayjs(row.date).format('DD MMM YYYY')}</TableCell>
                    <TableCell align="right">{`${row.startTime} - ${row.endTime}`}</TableCell>
                    <TableCell align="right">{row.jumlahPeserta}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {
            dataTable.length === 0 && (
              <Typography textAlign={'center'} fontStyle={'italic'}>no data available here</Typography>
            )
          }
        </CardContent>
      </Card>
    </Stack>

  )
}

export default RuangMeetingPage
