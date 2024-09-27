"use client";
import { useEffect, useRef, useState } from "react";
import axios from "../utils/getServerAxios";
import { DataType, ITableProps, kaReducer, Table, useTable } from "ka-table";
import {
  ActionType,
  FilteringMode,
  SortDirection,
  SortingMode,
} from "ka-table/enums";
import { getSortedColumns } from "ka-table/Utils/PropsUtils";
import { DispatchFunc } from "ka-table/types";
import { IFilterRowEditorProps } from "ka-table/props";
import { updateFilterRowValue } from "ka-table/actionCreators";
import { debounce } from "@/utils/debounce";
import { useRouter } from "next/navigation";

interface fetchDataInterface {
  offset?: number;
  sort?: sortInterface;
  flavor_profile?: string;
  diet?: "vegetarian" | "non vegetarian";
  name?: string;
  state?: string;
}

interface sortInterface {
  sortBy?: string;
  orderBy?: "ascend" | "descend";
}

const FoodTable: React.FC = () => {
  const router = useRouter();
  const [allowedColumnToSort] = useState<string[]>([
    "name",
    "cook_time",
    "prep_time",
  ]);
  const [foods, setFoods] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [foodFetchStatus, setFoodFetchStatus] = useState<string>("IDLE");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const filterRef = useRef<any>({});

  const fetchFoods = async (fetchFoodsArgs: fetchDataInterface = {}) => {
    try {
      setFoodFetchStatus("LOADING");

      /*<-- filter params -->*/
      const {
        name = null,
        diet = null,
        state = null,
        flavor_profile = null,
      } = filterRef.current;

      const nameParam = name ? `&name=${name}` : "";
      const dietParam = diet ? `&diet=${diet}` : "";
      const stateParam = state ? `&state=${state}` : "";
      const flavor_profileParam = flavor_profile
        ? `&flavor_profile=${flavor_profile}`
        : "";

      /*<-- sort params -->*/
      const sortedColumn = getSortedColumns(tableProps)[0];
      const { sortBy, orderBy } = {
        orderBy: sortedColumn?.sortDirection || null,
        sortBy: sortedColumn?.key || null,
      };

      const { offset = 0 } = fetchFoodsArgs;
      const sortParams =
        sortBy && orderBy ? `&sortBy=${sortBy}&orderBy=${orderBy}` : "";

      const { data } = await axios.get(
        `/items?offset=${offset * 15}&limit=15` +
          sortParams +
          nameParam +
          dietParam +
          stateParam +
          flavor_profileParam
      );
      setFoods(data.data);
      setTotalPages(Math.floor(data.pagination.total / 15 + 1));
      setFoodFetchStatus("IDLE");
    } catch (error) {
      console.log("food data fetch error", error);
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
      {
        key: "name",
        title: "Name",
        dataType: DataType.String,
        style: { cursor: "pointer" },
      },
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
    // update data when table sort
    if (
      action.type === ActionType.UpdateSortDirection &&
      allowedColumnToSort.includes(action.columnKey)
    ) {
      changeTableProps((prevState: ITableProps) =>
        kaReducer(prevState, action)
      );
      await fetchFoods();
    }
    // fetch data when page index change
    if (action.type === ActionType.UpdatePageIndex) {
      if (currentIndex !== action.pageIndex) {
        changeTableProps((prevState: ITableProps) =>
          kaReducer(prevState, action)
        );
        await fetchFoods({ offset: action.pageIndex });
        setCurrentIndex(action.pageIndex);
      }
    }

    if (action.type === ActionType.UpdateFilterRowValue) {
      filterRef.current = {
        ...filterRef.current,
        [action.columnKey]: action.filterRowValue,
      };
      await fetchFoods();
    }
  };

  // custom filter components
  const InputTextFiler = ({ column, dispatch }: IFilterRowEditorProps) => {
    const key: string = column.key;
    const handleInputChange = debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        dispatch(updateFilterRowValue(column.key, value || null));
      },
      500
    );

    return (
      <div>
        <input
          defaultValue={filterRef.current?.[key]}
          style={{ width: 60 }}
          onChange={handleInputChange}
          type="text"
          placeholder="search here..."
          className="!w-full"
        />
      </div>
    );
  };

  // dropdown for diet selection filter
  const DietSelector = ({ column, dispatch }: IFilterRowEditorProps) => {
    const handleDietChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(updateFilterRowValue("diet", e.target.value));
    };
    return (
      <select
        onChange={handleDietChange}
        value={filterRef.current?.["diet"] || ""}
      >
        <option value={""}>Select Diet</option>
        <option value={"vegetarian"}>Veg</option>
        <option value={"non vegetarian"}>Non Veg</option>
      </select>
    );
  };

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
        filteringMode={FilteringMode.FilterRow}
        childComponents={{
          tableWrapper: {
            elementAttributes: () => ({
              style: { maxHeight: 700 },
            }),
          },
          filterRowCell: {
            content: (props) => {
              switch (props.column.key) {
                case "ingredients":
                  return <></>;
                case "prep_time":
                  return <></>;
                case "cook_time":
                  return <></>;
                case "diet":
                  return <DietSelector {...props} />;
                case "name":
                  return <InputTextFiler {...props} />;
                case "state":
                  return <InputTextFiler {...props} />;
                case "flavor_profile":
                  return <InputTextFiler {...props} />;
              }
            },
          },
          cell: {
            elementAttributes: () => ({
              onClick: (e, extendedEvent) => {
                const {
                  childProps: { field, rowData },
                } = extendedEvent;
                if (field === "name") {
                  router.push(`/food/${rowData.id}`);
                }
              },
            }),
          },
        }}
      />
    </div>
  );
};

export { FoodTable };
