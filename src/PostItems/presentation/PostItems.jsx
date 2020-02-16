import React, { useState } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import {
  FilteringState,
  IntegratedFiltering,
  EditingState
} from "@devexpress/dx-react-grid";

import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  TableEditRow,
  TableEditColumn
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
      title: "Post",
      getCellValue: row => (row.post ? row.post.title : undefined)
    },
    {
      name: "album",
      title: "Album",
      getCellValue: row => (row.album ? row.album.title : undefined)
    },
    {
      name: "user",
      title: "User",
      getCellValue: row => (row.user ? row.user.name : undefined)
    }
  ]);

  const commitChanges = ({ changed, deleted }) => {
    if (changed) {
      props.editPostTitle(changed);
    }
    if (deleted) {
      props.deleteRow(deleted);
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

  const { postItems } = props;

  return (
    <Paper>
      <Grid rows={postItems} columns={columns} getRowId={getRowId}>
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
        <EditingState
          onCommitChanges={commitChanges}
          columnExtensions={editingStateColumnExtensions}
        />

        <Table tableComponent={TableComponent} />
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
