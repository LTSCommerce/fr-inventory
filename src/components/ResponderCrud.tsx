import * as React from 'react'
import BallotIcon from '@mui/icons-material/Ballot'

/**
 * Our custom services to load or persist data
 */

import { ResponderUpdate } from '../services/responder/updateResponder'
import { Responder } from '@prisma/client'
import { deleteResponderApi, updateResponderApi } from '../api-client/responder'
import { useRouter } from 'next/router'
import { GridActionsCellItem, GridColumns, GridRowId } from '@mui/x-data-grid'
import CrudDataGrid, {
  CreateEntityFn,
  DeleteEntityFn,
  UpdateEntityFn,
} from './CrudDataGrid'

interface ResponderCrudProps {
  rows: Responder[]
}

export default function ResponderCrud(props: ResponderCrudProps) {
  const router = useRouter()
  const fieldColumns: GridColumns = [
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
      editable: true,
      flex: 1,
      minWidth: 150,
    },
  ]

  const extraActions = (id: GridRowId) => {
    return [
      <GridActionsCellItem
        key="viewItemsAction"
        icon={<BallotIcon />}
        label="View Items"
        onClick={() => {
          router.push(`/responder-items/${id}`)
        }}
        color="inherit"
      />,
    ]
  }

  const createEntityFn: CreateEntityFn = async () => {
    return await updateResponderApi({
      id: -1,
      name: '',
      callsign: '',
    })
  }
  const updateEntityFn: UpdateEntityFn = async (updatedRow) => {
    const updateData: ResponderUpdate = {
      id: updatedRow.id,
      callsign: updatedRow.callsign,
      name: updatedRow.name,
    }
    // Make the HTTP request to save in the backend
    return await updateResponderApi(updateData)
  }
  const deleteEntityFn: DeleteEntityFn = (id) => {
    deleteResponderApi(id)
  }
  return (
    <CrudDataGrid
      rows={props.rows}
      fieldColumns={fieldColumns}
      extraActions={extraActions}
      createEntityFn={createEntityFn}
      updateEntityFn={updateEntityFn}
      deleteEntityFn={deleteEntityFn}
    ></CrudDataGrid>
  )
}
