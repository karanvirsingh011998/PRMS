import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CheckboxSection,
  ColorLaneNames,
  EditInputWrapper,
  LaneTableWrapper,
} from "styles/components/CreateNewLane";
import {
  MainSection,
  ModalButton,
  ButtonWrapper,
} from "styles/components/CreateNewLane";
import ColorPalette from "./ColorPalette";
import SaveTick from "assets/Svg/TeamBoardSettings/SaveTick";
import TrashIcon from "assets/Svg/TeamBoardSettings/TrashIcon";
import { AlignItems } from "styles/pages/Create";
import PencilEdit from "assets/Svg/TeamBoardSettings/PencilEdit";
import useGet from "hooks/useGet";
import usePost from "hooks/usePost";
const EditLane = ({ boardId, showModal }: any) => {
  const [data, setData] = useState<Item[]>([]);
  const originData: Item[] = [
    {
      _id: "1",
      statusLane: "Todo",
      color: "#D3D3D3",
      isNotSpillOver: true,
    },
    {
      _id: "2",
      statusLane: "In Progress",
      color: "#404B7C",
      isNotSpillOver: true,
    },
    {
      _id: "3",
      statusLane: "Done",
      color: "#5FAF7A",
      isNotSpillOver: false,
      editable: false,
    },
    // {
    //   _id: "4",
    //   statusLane: "Closed/Won’t Do",
    //   color: "",
    //   isNotSpillOver: "",
    // },
    // {
    //   _id: "5",
    //   statusLane: "Won’t Do",
    //   color: "",
    //   isNotSpillOver: "",
    // },
    // {
    //   _id: 6,
    //   statusLane: "Done",
    //   color: <ColorPalette />,
    //   isNotSpillOver: (
    //     <CheckboxSection>
    //       <Checkbox>Yes</Checkbox> <Checkbox>No</Checkbox>{" "}
    //     </CheckboxSection>
    //   ),
    // },
    // {
    //   _id: 7,
    //   statusLane: "Dev Complete",
    //   color: <ColorPalette />,
    //   isNotSpillOver: (
    //     <CheckboxSection>
    //       <Checkbox>Yes</Checkbox> <Checkbox>No</Checkbox>{" "}
    //     </CheckboxSection>
    //   ),
    // },
    // {
    //   _id: 8,
    //   statusLane: "Ready for Prod",
    //   color: <ColorPalette />,
    //   isNotSpillOver: (
    //     <CheckboxSection>
    //       <Checkbox>Yes</Checkbox> <Checkbox>No</Checkbox>{" "}
    //     </CheckboxSection>
    //   ),
    // },
  ];
  type Item = {
    _id: string;
    statusLane: string;
    color: string;
    isNotSpillOver: boolean;
    editable?: boolean;
  };
  const { refetch: fetchLanesData, data: lanesData } = useGet(
    "memderData",
    `/api/boards/statusLanes/${boardId}`,
    true
  );

  useEffect(() => {
    fetchLanesData();
  }, []);
  useEffect(() => {
    lanesData != undefined &&
      setData([...originData, ...lanesData?.data?.board?.epicsSettings]);
  }, [lanesData]);

  const [editedColor, setEditedColor] = useState<any>("");
  const [spillOver, setspillOver] = useState<any>("");
  const [laneData, setlaneData] = useState<any>();
  console.log("laneData", laneData);

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: "text" | "isNotSpillOver" | "color";
    record: Item;
    index: number;
    children: React.ReactNode;
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    //   const [value, setValue] = useState<any>();
    //   useEffect(() => {
    //     setValue(record.isNotSpillOver);
    //   }, []);
    //   const handleInputChange = (value: any) => {
    //   // setspillOver(value);
    //   setlaneData((prevData: any) => ({ ...prevData, newLane: value }));
    // };
    // const handleRadioChange = (value: any) => {
    //   setValue(value);
    //   setlaneData((prevData: any) => ({ ...prevData, isNotSpillOver: value }));
    // };

    const inputNode =
      inputType === "text" ? (
        <EditInputWrapper>
          <Input
            defaultValue={record?.statusLane}
            placeholder="Enter New Name"
            style={{ width: "150px" }}
          />
        </EditInputWrapper>
      ) : inputType == "isNotSpillOver" ? (
        <CheckboxSection>
          <Radio.Group
            name={record?.statusLane}
            // value={value}
            // onChange={(e) => handleRadioChange(e.target.value)}
          >
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </CheckboxSection>
      ) : (
        <ColorPalette
          setEditedColor={setEditedColor}
          disable={false}
          selectedColor={record?.color}
        />
      );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  // const EditableCell: React.FC<EditableCellProps> = ({
  //   editing,
  //   dataIndex,
  //   title,
  //   inputType,
  //   record,
  //   index,
  //   children,
  //   ...restProps
  // }) => {
  //   console.log("record.isNotSpillOver", record);
  //   // const [value, setValue] = useState(record.isNotSpillOver);

  //   const inputNode =
  //     inputType === "text" ? (
  //       <EditInputWrapper>
  //         <Input
  //           defaultValue={record?.statusLane}
  //           placeholder="Enter New Name"
  //           style={{ width: "150px" }}
  //           // onChange={(e: any) => handleInputChange(e.target.value)}
  //         />
  //       </EditInputWrapper>
  //     ) : inputType == "isNotSpillOver" ? (
  //       <CheckboxSection>
  //         <Radio.Group
  //           name={record?.statusLane}
  //           // value={value}
  //           // onChange={(e) => handleRadioChange(e.target.value)}
  //         >
  //           <Radio value={"true"}>Yes</Radio>
  //           <Radio value={"false"}>No</Radio>
  //         </Radio.Group>
  //       </CheckboxSection>
  //     ) : (
  //       <ColorPalette
  //         setEditedColor={setEditedColor}
  //         disable={false}
  //         selectedColor={record?.color}
  //       />
  //     );

  //   return (
  //     <td {...restProps}>
  //       {editing ? (
  //         <Form.Item
  //           name={dataIndex}
  //           style={{ margin: 0 }}
  //           rules={[
  //             {
  //               required: true,
  //               message: `Please Input ${title}!`,
  //             },
  //           ]}
  //         >
  //           {inputNode}
  //         </Form.Item>
  //       ) : (
  //         children
  //       )}
  //     </td>
  //   );
  // };
  const { mutateAsync } = usePost();

  const deleteLane = async (record: any) => {
    const lanes = data?.filter((deleteItem: any) => {
      return deleteItem?._id !== record?._id;
    });
    setData(lanes);
    setEditingKey("");
  };
  const edit = (record: any) => {
    console.log("record", record);
    form.setFieldsValue({
      // oldLane: record?.statuslane,
      statusLane: "",
      color: "",
      isNotSpillOver: "",
      ...record,
    });
    setEditingKey(record._id.toString());
  };
  // const save = async (record: any) => {
  //   console.log("record", record);
  //   try {
  //     const row = (await form.validateFields()) as Item;
  //     const newData = [...data];
  //     const index = newData.findIndex((item) => record._id === item._id);
  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, {
  //         ...item,
  //         ...row,
  //       });
  //       setData(newData);
  //       setEditingKey("");
  //     } else {
  //       newData.push(row);
  //       setData(newData);
  //       setEditingKey("");
  //     }
  //     console.log("newData", newData);
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //   }
  // };

  const save = async (record: any) => {
    console.log("record", record);
    try {
      const row = (await form.validateFields()) as Item;
      const newData = [...data];
      const index = newData.findIndex((item) => record._id === item._id);

      if (index > -1) {
        const item = newData[index];
        const updatedRow = {
          ...item,
          ...row,
        };
        newData.splice(index, 1, updatedRow);
        // setData(newData);
        setEditingKey("");

        // Now 'updatedRow' contains the edited data
        console.log("Edited Data:", updatedRow);
      } else {
        newData.push(row);
        // setData(newData);
        setEditingKey("");
      }
      console.log("newData", newData);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Edit Lanes",
      dataIndex: "statusLane",
      editable: true,
      render: (value: string, recode: any) => {
        return (
          <ColorLaneNames backgroundColor={recode?.color}>
            {value?.toUpperCase()}
          </ColorLaneNames>
        );
      },
    },
    {
      title: "Color Code",
      dataIndex: "color",
      editable: true,
      render: (value: string, recode: any) => (
        <ColorPalette disable={true} selectedColor={recode?.color} />
      ),
    },
    {
      title: "Spill Over",
      dataIndex: "isNotSpillOver",
      editable: true,
      render: (value: string, record: any) => (
        <CheckboxSection>
          <Radio.Group
            name={record?.statusLane}
            defaultValue={record.isNotSpillOver}
            disabled
            // onChange={(e) =>
            // handleRadioChange(record.statusLane, e.target.value)
            // }
          >
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
          {/* <label>
            <input
              name={recode.statusLane}
              type="radio"
              defaultChecked={recode.isNotSpillOver == true}
              value={"Yes"}
            />
            Yes
          </label>
          <label>
            <input
              name={recode.statusLane}
              defaultChecked={recode.isNotSpillOver == false}
              type="radio"
              value="No"
            />
            No
          </label> */}
        </CheckboxSection>
      ),
    },
    {
      title: " ",
      dataIndex: "operation",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return (
          <AlignItems>
            {editable ? (
              <>
                <SaveTick
                  onClick={() => save(record)}
                  style={{ cursor: "pointer" }}
                />
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => deleteLane(record)}
                >
                  <TrashIcon style={{ cursor: "pointer" }} />
                </Popconfirm>
              </>
            ) : (
              <>
                <PencilEdit
                  style={{ cursor: "pointer" }}
                  onClick={() => edit(record)}
                />
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => deleteLane(record)}
                >
                  <TrashIcon style={{ cursor: "pointer" }} />
                </Popconfirm>
              </>
            )}
          </AlignItems>
        );
      },
    },
  ];

  const [form] = Form.useForm();
  const activeColor = useSelector(
    (state: any) => state?.colorSlice?.activeColor
  );
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: any) => record?._id == editingKey.toString();

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => {
        return {
          record,
          inputType:
            col.dataIndex == "statusLane"
              ? "text"
              : col.dataIndex == "isNotSpillOver"
              ? "isNotSpillOver"
              : "color",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        };
      },
    };
  });
  const disableFirstThreeRows = (record: any, rowIndex: any) => {
    return rowIndex < 3 ? "disabled-row" : "";
  };
  const updateOnelane = async () => {
    const payload = {
      boardId,
    };
    try {
      const response = await mutateAsync({
        url: "/api/boards/statusLanes/update",
        payload,
      });
      if (response?.status === 200) {
        showModal(false);
      }
    } catch (error: any) {
      console.log("error", error);
    }
    // /api/boards/statusLanes/update
    // {
    //   "boardId": "string",
    //   "oldLane": "string",
    //   "newLane": "string",
    //   "isNotSpillOver": true,
    //   "color": "string"
    // }
  };

  const updateAll = async () => {
    const payload = {
      boardId,
    };
    try {
      const response = await mutateAsync({
        url: "/api/boards/statusLanes/updateAll",
        payload,
      });
      if (response?.status === 200) {
        showModal(false);
      }
    } catch (error: any) {
      console.log("error", error);
    }
    // /api/boards/statusLanes/updateAll
    // {
    //   "boardId": "string",
    //   "statusLanes": [
    //     {
    //       "oldLane": "string",
    //       "newLane": "string",
    //       "isNotSpillOver": true,
    //       "color": "string"
    //     }
    //   ]
    // }
  };
  return (
    <MainSection>
      <LaneTableWrapper>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={data}
          columns={mergedColumns}
          pagination={false}
          rowClassName={disableFirstThreeRows}
        />
      </LaneTableWrapper>
      <ButtonWrapper>
        <ModalButton onClick={() => showModal(false)} color={activeColor}>
          Cancel
        </ModalButton>
        <ModalButton onClick={() => updateAll()} color={activeColor}>
          Update
        </ModalButton>
      </ButtonWrapper>
    </MainSection>
  );
};

export default EditLane;
