"use client";
import { useEffect, useState } from "react";
import axios from "../utils/getServerAxios";
import { DataType, ITableProps, kaReducer, Table, useTable } from "ka-table";
import { ActionType, SortDirection, SortingMode } from "ka-table/enums";
import { getSortedColumns } from "ka-table/Utils/PropsUtils";
import { DispatchFunc } from "ka-table/types";

interface fetchDataInterface {
  offset?: number;
  sort?: sortInterface;
}

interface sortInterface {
  sortBy?: string;
  orderBy?: "ascend" | "descend";
}

const FoodTable: React.FC = () => {
  const [allowedColumnToSort] = useState<string[]>([
    "name",
    "cook_time",
    "prep_time",
  ]);
  const [foods, setFoods] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [foodFetchStatus, setFoodFetchStatus] = useState<string>("IDLE");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const fetchFoods = async (fetchFoodsArgs: fetchDataInterface = {}) => {
    try {
      const { offset = 0, sort: { sortBy, orderBy } = {} } = fetchFoodsArgs;
      setFoodFetchStatus("LOADING");
      const sortParams =
        sortBy && orderBy ? `&sortBy=${sortBy}&orderBy=${orderBy}` : "";
      const { data } = await axios.get(
        `/items?offset=${offset * 15}&limit=15` + sortParams
      );
      setFoods(data.data);
      setTotalPages(Math.floor(data.pagination.total / 15 + 1));
      setFoodFetchStatus("IDLE");
    } catch (error) {
      setFoodFetchStatus("ERROR");
    }
  };

  // initial data fetch
  useEffect(() => {
    (async function () {
      await fetchFoods();
    })();
  }, []);

  const tablePropsInit: ITableProps = {
    columns: [
      { key: "name", title: "Name", dataType: DataType.String },
      {
        key: "ingredients",
        title: "Ingredients",
        dataType: DataType.String,
      },
      {
        key: "prep_time",
        title: "Prep Time",
        dataType: DataType.Number,
      },
      {
        key: "cook_time",
        title: "Cooking Time",
        dataType: DataType.Number,
      },
      {
        key: "diet",
        title: "Diet",
        dataType: DataType.String,
      },
      {
        key: "flavor_profile",
        title: "Flavor",
        dataType: DataType.String,
      },
      {
        key: "state",
        title: "State",
        dataType: DataType.String,
      },
    ],
    loading: {
      enabled: foodFetchStatus === "LOADING",
    },
    rowKeyField: "id",
    sortingMode: SortingMode.SingleRemote,
  };
  const [tableProps, changeTableProps] = useState(tablePropsInit);

  // handle table actions
  const dispatch: DispatchFunc = async (action) => {
    if (
      action.type === ActionType.UpdateSortDirection &&
      allowedColumnToSort.includes(action.columnKey)
    ) {
      changeTableProps((prevState: ITableProps) =>
        kaReducer(prevState, action)
      );
    }
    if (action.type === ActionType.UpdatePageIndex) {
      if (currentIndex !== action.pageIndex) {
        changeTableProps((prevState: ITableProps) =>
          kaReducer(prevState, action)
        );
        await fetchFoods({ offset: action.pageIndex });
        setCurrentIndex(action.pageIndex);
      }
    }
  };

  // handle sorting
  useEffect(() => {
    const sortedColumn = getSortedColumns(tableProps)[0];
    if (sortedColumn && allowedColumnToSort.includes(sortedColumn.key)) {
      (async function () {
        await fetchFoods({
          sort: {
            orderBy: sortedColumn.sortDirection,
            sortBy: sortedColumn.key,
          },
        });
      })();
    }
  }, [tableProps]);

  return (
    <div>
      <Table
        {...tableProps}
        dispatch={dispatch}
        data={foods}
        paging={{
          enabled: true,
          pagesCount: totalPages,
          pageIndex: currentIndex,
        }}
        childComponents={{
          tableWrapper: {
            elementAttributes: () => ({
              style: { maxHeight: 700 },
            }),
          },
        }}
      />
    </div>
  );
};

export { FoodTable };
