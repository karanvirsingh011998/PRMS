import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { Table, Input, Checkbox } from "antd";
import { MembersWrapper, TabWrapper } from "styles/Backlog";
import Members from "components/Avatar";
import { AvtarWrapper } from "styles/views/ProjectSection";
import AddPeopleModal from "views/BacklogTable/AddPeopleModal";

import AddLaneModal from "views/BacklogTable/AddLaneModal";
import {
  MainSection,
  Headingwrapper,
  Heading,
  ButtonWrapper,
  InputWrapper,
  InputContainer,
  ErrorMessageWrapper,
  FieldSection,
  TableSection,
  FilterSelect,
  InputWrapperSection,
  InputTitleHeading,
  TitleHeading,
  BtnWrap,
  TeamBoardSection,
  TeamBoardSubSection,
  TeamBoardCustomSection,
  ButtonCreateWrapper,
  CustomHeading,
  CustomTableSection,
  CustomWrapper,
  CheckList,
} from "styles/views/SecondProjectSection";
import { UserManagementMainSection } from "styles/views/SecondProjectSection";
import FilterButton from "components/Select";
import Button from "components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tabs } from "antd";
import { TICKET_VALIDATION_SCHEMA } from "utils/createissuevalidation";
import BreadcrumbTab from "components/Breadcrumb";
import {
  LoadingOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  CloseOutlined,
  CheckCircleTwoTone,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { roleData } from "data/data";
import { useDispatch, useSelector } from "react-redux";
import useGet from "hooks/useGet";
import workForceInstance from "services/axiosInstance";
import { Modal as ModalData, notification } from "antd";
import { fetchCurrentWorkspace } from "store/currentWorkspaceSlice";
import usePost from "hooks/usePost";
import { fetchMember } from "store/memberSlice";
import { fetchProjects } from "store/projectSlice";
import UpdateProjectBoard from "components/Modal/editTeam";
import { LoaderContext } from "context/loader";
import usePut from "hooks/usePut";
import CustomModal from "components/CustomModal";
import EditCustomModal from "components/EditCustomModal";
import {
  ButtonContainer,
  FormContainer,
  FormWrapper,
  HeadingWrapper,
  MainContainer,
  MainWrapper,
  ModalHeader,
  ModalWrapper,
  Wrapper,
} from "styles/Backlog/AddPeopleModal";
import { CloseModalButton } from "styles/CustomModal";
import SpillOverModal from "components/SpillOverModal";
import { useTheme } from "components/Theme";
import { getTextColor } from "constants/themes";
import CreateNewLane from "./CreateNewLane";
import EditLane from "./EditLane";
type NotificationType = "success" | "info" | "warning" | "error";

const TeamBoardSettings = () => {
  const { mutateAsync } = usePost();
  const { mutateAsync: mutate } = usePut();

  const { TabPane } = Tabs;
  const [disable, setDisable] = useState(false);
  const [show, setShow] = useState("");
  const [showEditTeamBoard, setShowEditTeamBoard] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [activeButtons, setActiveButtons] = useState<any>([]);
  const [boardData, setBoardData] = useState<any>([]);
  const [epicVal, setEpicVal] = useState("");
  const [statusLane, setStatusLane] = useState("");
  const [boardId, setBoardId] = useState("");
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [teamBoardDetails, setTeamBoardDetails] = useState();

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    api[type]({
      message: message,
      description: description,
      duration: 4,
    });
  };

  const userId = useSelector((state: any) => state?.user?.data.user?._id);
  // const projectMemberList = useSelector((state: any) => state);
  const projectMemberList = useSelector(
    (state: any) => state?.currentWorkspace?.data?.data?.project.members
  );

  const currentWorkspaceData = useSelector(
    (state: any) => state?.currentWorkspace?.data?.data?.project
  );
  const [laneModal, setLaneModal] = useState(false);

  const { confirm } = ModalData;
  const dispatch = useDispatch();

  const {
    refetch: fetchData,
    data,
    isFetched,
  } = useGet(
    "epicsData",
    `api/boards/epics/${window.localStorage.getItem("workspaceId")}`,
    true
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [laneModal]);

  useEffect(() => {
    !showEditTeamBoard && fetchData();
  }, [showEditTeamBoard]);

  useEffect(() => {
    if (data?.data) {
      setBoardData(data.data.boardEpics);
    }
  }, [data, isFetched]);

  const removeMember = async (member: any) => {
    try {
      const responseDate = await workForceInstance.post(
        `/api/workspaces/deleteMember`,
        {
          projectId: localStorage.getItem("workspaceId"),
          memberId: member._id,
        },

        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (responseDate.status === 200) {
        const projects = currentWorkspaceData.projects;
        await Promise.all(
          projects?.map(async (project: any) => {
            const payload = {
              member: member.email,
              boardId: project._id,
              projectId: localStorage.getItem("workspaceId"),
            };

            try {
              await mutateAsync({
                url: "/api/projects/deleteMember",
                payload,
              });
            } catch (error: any) {
              console.error(
                `Failed to delete member from project ${project._id}:`,
                error
              );
            }
          })
        );

        dispatch(fetchCurrentWorkspace());
        dispatch(fetchMember());
        dispatch(fetchProjects());
        openNotificationWithIcon("success", `${responseDate.data.msg}`, "");
      }
    } catch (error: any) {
      openNotificationWithIcon(
        "error",
        `Something went wrong please try later.`,
        ""
      );
    }
  };

  // const removeCustomField = async (customField: any) => {
  //   try {
  //     const responseDate = await workForceInstance.post(
  //       `/api/CustomFields/delete`,
  //       {
  //         projectId: localStorage.getItem("workspaceId"),
  //         customFieldId: customField._id,
  //       },

  //       {
  //         headers: { token: localStorage.getItem("token") },
  //       }
  //     );
  //     if (responseDate.status === 200) {
  //       dispatch(fetchCurrentWorkspace());
  //       dispatch(fetchMember());
  //       dispatch(fetchProjects());
  //       openNotificationWithIcon("success", `${responseDate.data.msg}`, "");
  //     }
  //   } catch (error: any) {
  //     openNotificationWithIcon(
  //       "error",
  //       `Something went wrong please try later.`,
  //       ""
  //     );
  //   }
  // };

  const addlane = (id: string) => {
    setBoardId(id);
    setLaneModal(true);
  };

  const onCheckUserRole = async (e: any, user: any) => {
    if (e.target.checked) {
      setLoader(true);
      try {
        const payload = {
          members: [user.email],
          role: "user",
          boardId: user.boardId,
          projectId: window.localStorage.getItem("workspaceId"),
        };
        const response = await mutateAsync({
          url: "/api/projects/member",
          payload: payload,
        });
        if (response.status === 200) {
          dispatch(fetchMember());
          dispatch(fetchProjects());
          dispatch(fetchCurrentWorkspace());
          openNotificationWithIcon(
            "success",
            "Member added successfully",
            "You can now assign tasks to new member thankyou..."
          );
          setLoader(false);
        }
      } catch (error) {
        openNotificationWithIcon(
          "error",
          "Member not added",
          "Please try after sometime."
        );
      }
    } else {
      setLoader(true);
      try {
        const payload = {
          member: user.email,
          boardId: user.boardId,
          projectId: window.localStorage.getItem("workspaceId"),
        };
        const response = await mutateAsync({
          url: "/api/projects/deleteMember",
          payload: payload,
        });
        if (response.status === 200) {
          dispatch(fetchProjects());
          dispatch(fetchCurrentWorkspace());
          openNotificationWithIcon(
            "success",
            "Member removed from the board successfully",
            ""
          );
          setLoader(false);
        }
      } catch (error) {
        openNotificationWithIcon(
          "error",
          "Member not removed.",
          "Please try after sometime."
        );
      }
    }
  };

  const showConfirm = (
    id: any,
    title: string,
    content: string,
    type: string
  ) => {
    confirm({
      title: title,
      icon: <ExclamationCircleFilled />,
      content: content,
      onOk() {
        if (type === "member") {
          removeMember(id);
        } else {
          deleteTeamBoard(id);
        }
      },
      onCancel() {},
    });
  };

  // const showConfirmCustom = (id: any, title: string, content: string) => {
  //   confirm({
  //     title: title,
  //     icon: <ExclamationCircleFilled />,
  //     content: content,
  //     onOk() {
  //       removeCustomField(id);
  //     },
  //     onCancel() {},
  //   });
  // };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, member: any) => {
        return (
          currentWorkspaceData?.createdBy !== member._id && (
            <DeleteOutlined
              onClick={() =>
                showConfirm(
                  member,
                  "Do you Want to delete this member?",
                  "Member will removed from your project.",
                  "member"
                )
              }
            />
          )
        );
      },
    },
  ];

  const columns1 = [
    {
      title: "Board",
      dataIndex: "board",
      key: "project",
      render: (board: any, boardData: any) => {
        return <span>{boardData.name}</span>;
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",

      render: (item: any, user: any) => {
        const createdBy = currentWorkspaceData?.createdBy;

        const filteredMember = currentWorkspaceData?.members?.filter(
          (item: any) => {
            return item?.memberId?._id == createdBy;
          }
        );
        return (
          <FilterSelect
            color={activeColor}
            style={{ textAlign: "start", zIndex: "1052 !important" }}
          >
            <FilterButton
              data={roleData}
              placeholder={"Role"}
              name={"role"}
              control={control}
              defaultValue={item}
              onBlur={(e: any) => changeUserRole(e, user)}
              disabled={
                currentWorkspaceData?.createdBy == user?.userId ||
                !(currentWorkspaceData?.createdBy == userId)
              }
              value={user?.role}
              style={{ width: "130px" }}
            />
          </FilterSelect>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (board: any, user: any) => {
        return (
          currentWorkspaceData.createdBy !== user.userId && (
            <Checkbox
              checked={user.role !== undefined}
              onChange={(e: any) => onCheckUserRole(e, user)}
            />
          )
        );
      },
    },
  ];
  // const columns2 = [
  //   {
  //     title: "Title",
  //     dataIndex: "title",
  //     key: "title",
  //   },
  //   {
  //     title: "Input Type",
  //     dataIndex: "dataType",
  //     key: "input type",
  //   },

  //   {
  //     title: "Task Type",
  //     dataIndex: "ticketType",
  //     key: "task type",
  //   },

  //   {
  //     title: "Action",
  //     dataIndex: "action",
  //     key: "action",
  //     render: (_: any, customData: any) => {
  //       return (
  //         <>
  //           <DeleteOutlined
  //             onClick={() =>
  //               showConfirmCustom(
  //                 customData,
  //                 "Do you Want to delete this Custom Field?",
  //                 "Custom Field will removed from your project."
  //               )
  //             }
  //           />
  //           &nbsp; &nbsp;
  //           <EditOutlined onClick={() => editcustom(customData)} />
  //         </>
  //       );
  //     },
  //   },
  // ];
  const {
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(TICKET_VALIDATION_SCHEMA),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      label: "",
      epicId: "",
    },
  });
  const [swimLines, setSwimLines] = useState<any>([]);
  const [createEpic, setCreateEpic] = useState(false);
  const [createEpicIndex, setCreateEpicIndex] = useState(-1);
  const [userList, setUserList] = useState([]);
  const [customData, setcustomDatat] = useState([]);
  const [customDataforEdit, setcustomDataforEdit] = useState([]);
  const [list, setList] = useState([]);
  const [toggleLoader, setToggleLoader] = useState(false);
  const projectInfo = useSelector((state: any) => state?.workspaces);
  const [swimLineVal, setSwimLineVal] = useState({});
  const [Workflow, setWorkflow] = useState([]);
  const { setLoader } = useContext(LoaderContext);
  const addNewEpic = () => {
    setCreateEpic(true);
  };
  const [projectData, setProjectData] = useState<any>();

  useEffect(() => {
    if (projectMemberList?.length > 0) {
      setProjectData(
        projectInfo?.data?.data?.myProjects?.find((item: any) => {
          return item._id === localStorage.getItem("workspaceId");
        })
      );
      const memlist = projectMemberList?.map((mem: any) => {
        const projects = currentWorkspaceData.boards?.map((elem: any) => {
          return {
            name: elem.name,
            role: mem?.memberId?.board.find((item: any) => {
              return item.boardId._id === elem._id;
            })?.role,
            userId: mem?.memberId?._id,
            boardId: elem._id,
            email: mem?.memberId?.email,
          };
        });
        return {
          name: mem?.memberId?.name,
          email: mem?.memberId?.email,
          role: mem?.role,
          _id: mem?.memberId?._id,
          key: mem?.memberId?._id,
          projects: projects,
        };
      });
      setList(memlist);
      setUserList(memlist);

      setSwimLines(currentWorkspaceData.workspaceEpics);
      setWorkflow(currentWorkspaceData.workspaceEpics);
    }
  }, [projectInfo, projectMemberList, currentWorkspaceData]);

  useEffect(() => {
    const customData = currentWorkspaceData?.customFields?.map((item: any) => {
      return {
        _id: item?._id,
        title: item?.title,
        dataType: item?.dataType,
        ticketType: item?.ticketType + " ",
        isMandatory: item?.isMandatory,
      };
    });
    setcustomDatat(customData);
  }, [currentWorkspaceData]);

  const filterUser = (e: any) => {
    if (e.target.value === "") {
      setUserList(list);
    }
    const value = e.target.value;
    const filteredUser = list?.filter((member: any) => {
      return (
        member.name.toLowerCase().includes(value.toLowerCase()) ||
        member.email.toLowerCase().includes(value.toLowerCase())
      );
    });
    setUserList(filteredUser);
  };

  const changeUserRole = async (e: any, user: any) => {
    if (e) {
      setLoader(true);
      try {
        const payload = {
          member: user.email,
          role: e,
          boardId: user.boardId,
          projectId: window.localStorage.getItem("workspaceId"),
        };
        const response = await mutate({
          url: "/api/projects/updateRole",
          payload: payload,
        });
        if (response.status === 200) {
          dispatch(fetchMember());
          dispatch(fetchProjects());
          dispatch(fetchCurrentWorkspace());
          openNotificationWithIcon(
            "success",
            "Member Updated successfully",
            "You can now assign tasks to new member thankyou..."
          );
          setLoader(false);
        }
      } catch (error) {
        openNotificationWithIcon(
          "error",
          "Member not added",
          "Please try after sometime."
        );
        setLoader(false);
      }
    }
  };

  const [memberModal, setMemberModal] = useState(false);
  const [customModal, setCustomModal] = useState(false);
  const [editcustomModal, seteditCustomModal] = useState(false);

  const expandedRowRender = (record: any) => {
    return (
      <Table
        columns={columns1}
        dataSource={record.projects}
        pagination={false}
      />
    );
  };

  const addmember = () => {
    setMemberModal(true);
  };
  const addcustom = () => {
    setCustomModal(true);
  };

  const editcustom = (custom: any) => {
    setcustomDataforEdit(custom);
    seteditCustomModal(true);
  };

  const projectMemberRole = localStorage.getItem("projectMemberRole");
  const projectName = window.localStorage.getItem("ProjectName");
  const defaultEpics = ["TODO", "IN PROGRESS", "DONE"];

  const deleteEpic = async (board: any, epic: string) => {
    const payload = {
      statusLane: epic,
      boardId: board?._id,
    };
    try {
      const response = await mutateAsync({
        url: "/api/boards/epics/delete",
        payload: payload,
      });
      if (response?.status === 200) {
        setShow("");
        openNotificationWithIcon(
          "success",
          `${epic} lane hase been deleted`,
          ""
        );

        setEpicVal("");
        setShow("");
        setCreateEpicIndex(-1);
        fetchData();
      }
    } catch (error: any) {
      openNotificationWithIcon("error", error?.response?.data?.msg, "");
    }
  };

  const addNewEpicInBoard = async (board: any, epic: string, index: any) => {
    const payload = {
      statusLane: epic,
      boardId: board?._id,
    };
    try {
      const response = await mutateAsync({
        url: "/api/boards/epics/add",
        payload: payload,
      });
      if (response?.status === 200) {
        openNotificationWithIcon(
          "success",
          "New status lane has been created",
          ""
        );
      }
      fetchData();
      setEpicVal("");
      setShow("");
      const arr = activeButtons?.filter((item: any) => item !== index);
      setActiveButtons(arr);
      setCreateEpicIndex(-1);
    } catch (error: any) {
      openNotificationWithIcon("error", error?.response?.data?.msg, "");
      setCreateEpicIndex(-1);
    }
  };

  const updateEpicInBoard = async (
    board: any,
    oldEpic: string,
    newEpic: string,
    index: any
  ) => {
    const payload = {
      oldEpic: oldEpic,
      newEpic: newEpic,
      boardId: board?._id,
    };
    if (newEpic) {
      try {
        const response = await mutateAsync({
          url: "/api/boards/epics/update",
          payload: payload,
        });
        if (response?.status === 200) {
          openNotificationWithIcon(
            "success",
            "Epic updated in the board successfully",
            ""
          );
          fetchData();
          setEpicVal("");
          setShow("");

          setNewEpicKey("");
          const arr = activeButtons?.filter((item: any) => item !== index);
          setActiveButtons(arr);
          setCreateEpicIndex(-1);
        }
      } catch (error: any) {
        openNotificationWithIcon("error", error?.response?.data?.msg, "");
        setCreateEpicIndex(-1);
      }
    } else {
      return;
    }
  };

  const [newEpicKey, setNewEpicKey] = useState("");

  const OnEpicCheck = async (e: any, board: any) => {
    const payload = {
      boardId: board?._id,
    };
    try {
      const response = await mutateAsync({
        url: "/api/boards/epics/lock",
        payload: payload,
      });
      if (response?.status === 200) {
        openNotificationWithIcon(
          "success",
          "Board setting updated successfully",
          ""
        );
      }
      fetchData();
    } catch (error: any) {
      openNotificationWithIcon("error", error?.response?.data?.msg, "");
    }
  };

  const updateArchive = async (e: any, board: any) => {
    setLoader(true);
    const payload = {
      data: {
        isArchived: e.target.checked,
      },
      boardId: board?._id,
    };

    try {
      const response = await mutateAsync({
        url: "/api/boards/update",
        payload: payload,
      });
      if (response.status == 200) {
        openNotificationWithIcon(
          "success",
          "Board setting updated successfully",
          ""
        );
        dispatch(fetchProjects());
        fetchData();
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
      if (error?.response?.status === 409) {
        setDisable(false);
        openNotificationWithIcon("error", `${error?.response?.data?.msg}`, "");
      } else {
        openNotificationWithIcon(
          "error",
          `${error?.response?.data?.errors?.[0]?.msg}`,
          "  "
        );
      }

      return { error: error?.response?.data?.errorMessage };
    }
  };

  const deleteTeamBoard = async (id: string) => {
    setLoader(true);
    const payload = {
      boardId: id,
    };

    try {
      const response = await mutateAsync({
        url: "/api/projects/delete",
        payload: payload,
      });
      if (response.status == 200) {
        openNotificationWithIcon("success", "Board Deleted successfully", "");
        dispatch(fetchProjects());
        fetchData();
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
      if (error?.response?.status === 409) {
        setDisable(false);
        openNotificationWithIcon("error", `${error?.response?.data?.msg}`, "");
      } else {
        openNotificationWithIcon(
          "error",
          `${error?.response?.data?.errors?.[0]?.msg}`,
          "  "
        );
      }

      return { error: error?.response?.data?.errorMessage };
    }
  };
  const openEditNotification = () => {
    openNotificationWithIcon(
      "success",
      "Updated Custom Field Successfully",
      "Thankyou..."
    );
  };
  const openEditFailedNotification = (error: any) => {
    openNotificationWithIcon("error", `${error}`, "Thankyou...");
  };
  const activeColor = useSelector(
    (state: any) => state?.colorSlice?.activeColor
  );
  return (
    <UserManagementMainSection>
      {contextHolder}
      <TabWrapper color={activeColor}>
        <BreadcrumbTab itemRender={projectData?.name} />
      </TabWrapper>
      <Headingwrapper>
        <Heading color={activeColor}>Team Board Settings</Heading>
        <AvtarWrapper>
          <MembersWrapper>
            <Members members={projectMemberList || []} />
          </MembersWrapper>
          {projectMemberRole === "admin" && (
            <ButtonWrapper onClick={addmember}>
              <Button
                type="submit"
                variant="contained"
                disable={disable}
                label={
                  disable ? (
                    <LoadingOutlined spin style={{ fontSize: "20px" }} />
                  ) : (
                    "Add Members"
                  )
                }
              />
            </ButtonWrapper>
          )}
        </AvtarWrapper>
      </Headingwrapper>
      <TeamBoardSection>
        {boardData?.length > 0 &&
          boardData?.map((board: any, index: number) => {
            return (
              <>
                <TeamBoardSubSection>
                  <Heading color={activeColor}>{board?.name}</Heading>
                  <Checkbox
                    checked={board?.isEpicLocked}
                    onChange={(e) => OnEpicCheck(e, board)}
                  >
                    <CheckList color={activeColor}>Freeze List</CheckList>
                  </Checkbox>
                  <Checkbox
                    checked={board?.isArchived}
                    onChange={(e) => updateArchive(e, board)}
                  >
                    <CheckList color={activeColor}>Archive</CheckList>
                  </Checkbox>
                  <BtnWrap
                    color={activeColor}
                    onClick={() => {
                      setTeamBoardDetails(board);
                      setShowEditTeamBoard(true);
                    }}
                  >
                    <EditOutlined color={activeColor} />
                    Edit
                  </BtnWrap>
                  <BtnWrap
                    color={activeColor}
                    onClick={() => addlane(board._id)}
                  >
                    Lane
                  </BtnWrap>

                  <InputWrapperSection>
                    {board?.epics?.map((epic: string, index2: number) => {
                      const key = `${board._id}-${index2}`;

                      return (
                        <InputWrapper key={index2}>
                          <InputContainer color={activeColor}>
                            <Input
                              type="text"
                              placeholder={epic}
                              defaultValue={epic?.toUpperCase()}
                              disabled={defaultEpics?.includes(epic)}
                              onClick={(e) => {
                                setEpicVal(e.currentTarget.value);
                                setShow(key);
                              }}
                              onChange={(e: any) => {
                                setEpicVal(e.currentTarget?.value);
                                setSwimLineVal({ [key]: e.target.value });
                              }}
                              suffix={
                                <div>
                                  {key == show && (
                                    <>
                                      <CheckCircleTwoTone
                                        twoToneColor="#52c41a"
                                        onClick={() => {
                                          if (
                                            epic === "" &&
                                            epicVal.trim().length > 0
                                          ) {
                                            addNewEpicInBoard(
                                              board,
                                              epicVal,
                                              index
                                            );
                                            board?.epics.pop();
                                          } else {
                                            updateEpicInBoard(
                                              board,
                                              epic,
                                              epicVal,
                                              index
                                            );
                                          }
                                        }}
                                      />
                                      <SettingOutlined
                                        onClick={() => {
                                          if (epic.length > 0) {
                                            setBoardId(board?._id);
                                            setStatusLane(epic);
                                            setShowSettingModal(true);
                                          } else {
                                            board.epics.pop();
                                            setSwimLineVal("");
                                            setShow("");
                                            setActiveButtons([]);
                                            setCreateEpicIndex(-1);
                                            setNewEpicKey("");
                                            setShow(``);
                                          }
                                        }}
                                      />
                                      <CloseOutlined
                                        onClick={(e) => {
                                          if (!epic) {
                                            board?.epics.pop();
                                            setSwimLineVal("");
                                            setShow("");
                                            setActiveButtons([]);
                                            setCreateEpicIndex(-1);
                                            setNewEpicKey("");
                                          }
                                        }}
                                      />

                                      <DeleteOutlined
                                        onClick={() => {
                                          if (epic.length > 0) {
                                            board.epics = board?.epics?.slice(
                                              0,
                                              index2
                                            );
                                            deleteEpic(board, epic);
                                          } else {
                                            board.epics.pop();
                                            setSwimLineVal("");
                                            setShow("");
                                            setActiveButtons([]);
                                            setCreateEpicIndex(-1);
                                            setNewEpicKey("");
                                            setShow(``);
                                          }
                                        }}
                                      />
                                    </>
                                  )}
                                </div>
                              }
                              className={`focus:border-0 focus:outline-none focus:ring  ${
                                errors.name
                                  ? "focus:ring-red-400"
                                  : "focus:ring-blue-500"
                              }`}
                            />
                            <ErrorMessageWrapper>
                              {errors.name ? (
                                <span className="text-rose-500 text-left text-sm">
                                  {errors?.name?.message}
                                </span>
                              ) : (
                                <span className="h-8"></span>
                              )}
                            </ErrorMessageWrapper>
                          </InputContainer>
                        </InputWrapper>
                      );
                    })}

                    {/* {createEpicIndex != index ? (
                      <TitleHeading>
                        <InputTitleHeading
                          color={activeColor}
                          onClick={() => {
                            // setAddLane(true);
                            let data = boardData;
                            data[index].epics = [...data[index].epics, ""];
                            addNewEpic();
                            setActiveButtons([index]);
                            setCreateEpicIndex(index);
                            setNewEpicKey(board._id);
                            setShow(`${board._id}-${board?.epics.length}`);
                          }}
                        >
                          + Add New List
                        </InputTitleHeading>
                      </TitleHeading>
                    ) : (
                      <></>
                    )} */}
                  </InputWrapperSection>
                </TeamBoardSubSection>
              </>
            );
          })}
      </TeamBoardSection>
      {/* settings for epic spillover */}
      <Modal
        isOpen={showSettingModal}
        onRequestClose={() => setShowSettingModal(false)}
        ariaHideApp={false}
      >
        <SpillOverModal
          openNotificationWithIcon={openNotificationWithIcon}
          setShow={setShowSettingModal}
          epic={statusLane}
          boardId={boardId}
        />
      </Modal>

      <Modal
        isOpen={memberModal}
        onRequestClose={() => setMemberModal(false)}
        ariaHideApp={false}
      >
        <AddPeopleModal showModal={(value: boolean) => setMemberModal(value)} />
      </Modal>
      <Modal
        isOpen={showEditTeamBoard}
        onRequestClose={() => setShowEditTeamBoard(false)}
        ariaHideApp={false}
      >
        <UpdateProjectBoard
          showModal={(value: boolean) => setShowEditTeamBoard(value)}
          teamBoardDetails={teamBoardDetails}
          fetchData={fetchData}
        />
      </Modal>

      <Modal
        isOpen={laneModal}
        onRequestClose={() => setLaneModal(false)}
        ariaHideApp={false}
      >
        <AddLaneModal
          boardId={boardId}
          showModal={(value: boolean) => setLaneModal(value)}
        />
      </Modal>
    </UserManagementMainSection>
  );
};

export default TeamBoardSettings;
