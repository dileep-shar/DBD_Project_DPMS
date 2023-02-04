import { funEmoji } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

export default function Table(props) {
  const [columns, setcolumns] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    getColumnNames(props.data);
    setData(props.data);
  }, [props.data]);

  function getColumnNames(data) {
    let ret = [];

    if (data == null || data.length == 0) return;
    let keys = Object.keys(data[0]);

    for (let i = 0; i < keys.length; i++) {
      ret.push({
        name: keys[i],
        selector: (row) => row[keys[i]],
        sortable: true,
      });
    }

    setcolumns(ret);
  }

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        responsive
        reorder={true}
        pagination={true}
        customStyles={{
          rows: {
            style: {
              backgroundColor: "#dde1ff",
              borderColor: "black",
              color:"black",
            },
          },
          headCells: {
            style: {
              backgroundColor: "black",
              color: "white",
              borderColor:"white"
            },
          },
          headRow:{
            style:{
              borderColor:"white"
            }
          }
        }}
      />
    </>
  );
}