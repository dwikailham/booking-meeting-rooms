/** React Imports */
import React, { useCallback, useMemo, useState } from "react";

// ** MUI Imports
import { CardContent, CardHeader, Grid, Typography, FormGroup, FormControlLabel, Checkbox, Card, Autocomplete, TextField, Divider, Box, Button, InputAdornment, Stack, Breadcrumbs } from '@mui/material'
import { NavigateNext } from "@mui/icons-material";

/** Next Imports */
import { useRouter } from 'next/router'
import Link from 'next/link'

/** Third Party Imports */
import { useForm, Controller } from 'react-hook-form'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'

/** Component Imports */
import { useGetMeetingRooms, useGetOffice, useGetJenisKonsumsi } from 'src/hooks'

/** Type Imports */
import { TListMasterMeetingRooms, TListMasterOffice, TListHour } from 'src/types'

type TForm = {
    office: TListMasterOffice | null
    meetingRooms: TListMasterMeetingRooms | null
    jumlahPeserta: string
    startTime: TListHour | null
    endTime: TListHour | null
    tanggalPelaksanaan: string
    nominal: number
}

const breadcrumbs = [
    <Link passHref key='1' href='/ruang-meeting' color='error'>
        <Typography key='1' sx={{ cursor: 'pointer' }}>
            Ruang Meeting
        </Typography>
    </Link>,
    <Typography key='4' fontWeight='600'>
        Pengajuan Perangkat
    </Typography>
]


const RuangMeetingPage = () => {
    /** Hooks */
    const router = useRouter();
    const [idSelected, setIdSelected] = useState<Array<string>>([])

    /** Queries */
    const { data: resListOffice } = useGetOffice()
    const { data: resListMeetingRooms } = useGetMeetingRooms()
    const { data: resListJenisKonsumsi } = useGetJenisKonsumsi()

    /** Stores */
    const useFormMethods = useForm<TForm>({
        defaultValues: {
            meetingRooms: null,
            office: null,
            endTime: null,
            startTime: null
        },
        reValidateMode: 'onChange',
        mode: 'all'
    })
    const { control, setValue, watch, register, formState: { errors } } = useFormMethods
    const watchState = watch()

    /** Functions */
    const listMeetingRooms = useMemo(() => resListMeetingRooms?.filter(el => watchState.office?.id === el.officeId), [resListMeetingRooms, watchState.office?.id])

    const hourList: Array<TListHour> = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
        code: i,
        label: `${i.toString().padStart(2, '0')}:00`
    })), [])

    const listJenisKonsumsi = useMemo(() => resListJenisKonsumsi?.filter((_, idx) => idx <= 2), [resListJenisKonsumsi])

    const onChangeJenisKonsumsi = useCallback((start: number, end: number) => {
        const selected: string[] = [];
        if (start < 11) {
            selected.push('1');
        }
        if (start < 14 && end > 11) {
            selected.push('2');
        }
        if (end > 14) {
            selected.push('3');
        }
        setIdSelected(selected)
    }, [])
    const listAmountSelected = useMemo(() => listJenisKonsumsi?.filter(el => idSelected.includes(el.id)).map(el => el.maxPrice), [idSelected, listJenisKonsumsi])
    const sumAmount = useMemo(() => listAmountSelected?.reduce((a, b) => a + b, 0), [listAmountSelected])
    const valueAmount = useMemo(() => Number(watchState.jumlahPeserta || 0) * (sumAmount || 0), [sumAmount, watchState.jumlahPeserta])

    const handleDisabledBtn = useCallback(() => {
        const { endTime, jumlahPeserta, meetingRooms, office, startTime, tanggalPelaksanaan } = watchState

        if (isEmpty(office) || isEmpty(meetingRooms) || isEmpty(jumlahPeserta) || isEmpty(endTime) || isEmpty(startTime) || isEmpty(tanggalPelaksanaan)) {
            return true
        }
        if (!isEmpty(errors)) {
            return true
        }

        return false
    }, [errors, watchState])

    const handleSubmit = useCallback(() => {
        const { endTime, jumlahPeserta, meetingRooms, office, startTime, tanggalPelaksanaan } = watchState
        const dataTable = JSON.parse(window.localStorage.getItem('bookedMeetingRooms') || "[]") || [];
        const dataSubmit = {
            date: tanggalPelaksanaan,
            endTime: endTime?.label,
            startTime: startTime?.label,
            jumlahPeserta,
            meetingRooms: meetingRooms?.roomName,
            office: office?.officeName,
        }
        dataTable.push(dataSubmit)
        
        window.localStorage.setItem('bookedMeetingRooms', JSON.stringify(dataTable))
        router.back()

    }, [router, watchState])

    return (
        <Stack spacing={5}>
            <Breadcrumbs separator={<NavigateNext fontSize='small' />} aria-label='breadcrumb'>
                {breadcrumbs}
            </Breadcrumbs>
            <Card>
                <CardHeader title='Pengajuan Perangkat' />
                <CardContent>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Typography fontWeight={'bold'}>Informasi Ruang Meeting</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name='office'
                                control={control}
                                render={({ field: { onChange, ...rest } }) => (
                                    <Autocomplete
                                        {...rest}
                                        options={resListOffice || []}
                                        getOptionLabel={(option) => option.officeName}
                                        fullWidth
                                        onChange={(_, newValue) => {
                                            onChange(newValue)
                                            setValue('meetingRooms', null)
                                            setValue('jumlahPeserta', '')
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth label="Unit" />}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name='meetingRooms'
                                control={control}
                                render={({ field: { onChange, ...rest } }) => (
                                    <Autocomplete
                                        {...rest}
                                        options={listMeetingRooms || []}
                                        getOptionLabel={(option) => option.roomName}
                                        fullWidth
                                        onChange={(_, newValue) => {
                                            onChange(newValue)
                                            setValue('jumlahPeserta', '')
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Ruang Meeting" />}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField disabled label="Kapasitas" fullWidth InputLabelProps={{ shrink: true }} value={watchState.meetingRooms?.capacity || 0} />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography fontWeight={'bold'}>Informasi Rapat</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                type="date"
                                {...register(`tanggalPelaksanaan`, {
                                })}
                                InputProps={{
                                    inputProps: {
                                        min: dayjs().format('YYYY-MM-DD'),
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                label="Tanggal Rapat"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name='startTime'
                                control={control}
                                render={({ field: { onChange, ...rest } }) => (
                                    <Autocomplete
                                        {...rest}
                                        options={hourList || []}
                                        getOptionLabel={(option) => option.label}
                                        disabled={!Boolean(watchState.tanggalPelaksanaan)}
                                        fullWidth
                                        onChange={(_, newValue) => {
                                            setValue('endTime', null)
                                            onChange(newValue)
                                            onChangeJenisKonsumsi(newValue?.code || 0, watchState.endTime?.code || 0)
                                            if (!Boolean(newValue)) {
                                                setIdSelected([])
                                            }
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Waktu Mulai" />}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name='endTime'
                                control={control}
                                render={({ field: { onChange, ...rest } }) => (
                                    <Autocomplete
                                        {...rest}
                                        disabled={!Boolean(watchState.startTime)}
                                        options={hourList.filter(el => el.code > (watchState.startTime?.code || 0))}
                                        getOptionLabel={(option) => option.label}
                                        fullWidth
                                        onChange={(_, newValue) => {
                                            onChange(newValue)
                                            onChangeJenisKonsumsi(watchState.startTime?.code || 0, newValue?.code || 0)
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Waktu Selesai" />}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name='jumlahPeserta'
                                rules={{
                                    validate: (value) => {
                                        const max = watchState.meetingRooms?.capacity ?? 0;
                                        if (Number(value) > max) {
                                            return `Maximal ruangan berjumlah ${max}`;
                                        }

                                        return true;
                                    }
                                }}
                                control={control}
                                render={({ field: { onChange, ...rest } }) => (
                                    <TextField
                                        {...rest}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            onChange(e)
                                            setValue('nominal', Number(val) * (sumAmount || 0))
                                        }}
                                        label="Jumlah Peserta"
                                        fullWidth
                                        onKeyPress={event => {
                                            if (!/^[0-9|]+$/.test(event.key)) {
                                                event.preventDefault()
                                            }
                                        }}
                                        error={Boolean(errors.jumlahPeserta)}
                                        helperText={errors.jumlahPeserta?.message || ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Jenis Konsumsi</Typography>
                            <FormGroup>
                                {
                                    Boolean(listJenisKonsumsi?.length) && listJenisKonsumsi?.map((el) => (
                                        <FormControlLabel disabled control={<Checkbox />} checked={idSelected.includes(el.id)} label={el.name} key={el.id} />
                                    ))
                                }
                            </FormGroup>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                disabled
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                label="Nominal"
                                value={valueAmount}
                                fullWidth sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            gap: 3
                        }}
                    >
                        <Button color="error" onClick={() => router.back()}>Batal</Button>
                        <Button color="primary" disabled={handleDisabledBtn()} variant="contained" onClick={handleSubmit}>Simpan</Button>
                    </Box>
                </CardContent>
            </Card>
        </Stack>
    )
}

export default RuangMeetingPage
