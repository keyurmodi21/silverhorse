import React, { useState } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import {
  FilteringState,
  IntegratedFiltering,
  EditingState,
  ChangeSet
} from "@devexpress/dx-react-grid";

import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  TableEditRow,
  TableEditColumn,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";


const styles = theme => ({
  tableStriped: {
    "& tbody tr:nth-of-type(odd)": {
      backgroundColor: "rgba(255, 183, 77, 0.15)"
    }
  }
});

const TableComponentBase = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} className={classes.tableStriped} />
);

export const TableComponent = withStyles(styles, { name: "TableComponent" })(
  TableComponentBase
);

const getRowId = row => row.id;

function PostItems(props) {
  const [columns] = useState([
    {
      name: "post",
      title: "POST",
      getCellValue: row => (row.post ? row.post.title : undefined)
    },
    {
      name: "album",
      title: "ALBUM",
      getCellValue: row => (row.album ? row.album.title : undefined)
    },
    {
      name: "user",
      title: "USER",
      getCellValue: row => (row.user ? row.user.name : undefined)
    }
  ]);

  const commitChanges = (commit: ChangeSet) => {
    if (commit.changed) {
      props.editPostTitle(commit.changed);
    }
    if (commit.deleted) {
      props.deleteRow(commit.deleted);
    }
  };

  const editingStateColumnExtensions = [
    {
      columnName: "user",
      editingEnabled: false
    },
    {
      columnName: "album",
      editingEnabled: false
    },
    {
      columnName: "post",
      createRowChange: (row, value) => ({ post: { ...row.post, title: value } })
    }
  ];

  const Root = props => <Grid.Root {...props} style={{ height: "100%" }} />;
  const { postItems } = props;

  return (
    <Paper style={{ height: '100vh' }}>
      <Grid rows={postItems} columns={columns} getRowId={getRowId} rootComponent={Root}>
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
        <EditingState
          onCommitChanges={commitChanges}
          columnExtensions={editingStateColumnExtensions}
        />

        <Table tableComponent={TableComponent} />
        <VirtualTable />
        <TableHeaderRow />
        <TableFilterRow />
        <TableEditRow />
        <TableEditColumn showEditCommand showDeleteCommand />
      </Grid>
    </Paper>
  );
}

PostItems.propTypes = {
  postItems: PropTypes.array.isRequired,
  deleteRow: PropTypes.func.isRequired,
  editPostTitle: PropTypes.func.isRequired
};
export default PostItems;
