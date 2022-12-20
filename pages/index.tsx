import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Box from '@mui/material/Box';
import {DataGrid, GridColumns} from '@mui/x-data-grid';
import {
    PrismaClient,
    // Prisma,
    Responder,
    // ItemType,
    // ResponderItem,
} from "@prisma/client";
import {InferGetStaticPropsType} from 'next'

const columns: GridColumns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90
    },
    {
        field: 'name',
        headerName: 'Name',
        editable: true,
        flex: 1,
        minWidth: 150,
    },
    {
        field: 'callsign',
        headerName: 'Call Sign',
        flex: 1,
        minWidth: 150,
    },
    {
        field: 'createdAt',
        headerName: 'Created',
        width: 150,
        editable: false,
        valueFormatter: params => new Date(params?.value)
    },
    {
        field: 'updatedAt',
        headerName: 'Updated',
        width: 150,
        editable: false,
        valueFormatter: params => new Date(params?.value)
    },
];

export const getStaticProps = async () => {
    const prisma = new PrismaClient();
    const data: Responder[] = await prisma.responder.findMany()
    const dataSer = JSON.parse(JSON.stringify(data));
    return {
        props: {
            data: dataSer
        } // will be passed to the page component as props
    }
}

export default function Home({data}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <Head>
                <title>Inventory</title>
                <meta name="description" content=""/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                {/*<link rel="icon" href="/favicon.ico" />*/}
            </Head>
            <main className={styles.main}>
                <Box sx={{height: 400, width: '100%'}}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{newEditingApi: true}}
                    />
                </Box>
            </main>
        </>
    )
}
