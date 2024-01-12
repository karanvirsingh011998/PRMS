import React, { useState } from "react";
import {
  Wrapper,
  MainSection,
  FirstSection,
  SecondSection,
  CheckboxSection,
  ColorContainer,
  Box1,
  ModalButton,
  ButtonWrapper,
} from "styles/components/CreateNewLane";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { CheckCircleFilled } from "@ant-design/icons";
import { laneColorData } from "components/Modal/data";
import { Checkbox, Input } from "antd";
import PencilEdit from "assets/Svg/TeamBoardSettings/PencilEdit";
import usePost from "hooks/usePost";

const CreateNewLane = ({ boardId, showModal }: any) => {
  // {
  //   "boardId": "string",
  //   "statusLane": "string",
  //   "isNotSpillOver": true,
  //   "color": "string"
  // }
  const {
    handleSubmit,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      statusLane: "",
      color: "",
      isNotSpillOver: "No",
    },
  });
  const activeColor = useSelector(
    (state: any) => state?.colorSlice?.activeColor
  );
  const [backgroundColor, setBgColor] = useState("");
  const handleClick = (color: string, id: number) => {
    setBgColor(color);
    setBgIndex(id);
  };
  const { mutateAsync } = usePost();
  const submitData = async (data: any) => {
    const payload = {
      ...data,
      isNotSpillOver: data.isNotSpillOver == "No" ? false : true,
      boardId,
    };
    try {
      const response = await mutateAsync({
        url: "/api/boards/statusLanes/add",
        payload,
      });
      if (response?.status === 200) {
        showModal(false);
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };
  const [bgIndex, setBgIndex] = useState(-1);

  return (
    <Wrapper>
      <form onSubmit={handleSubmit(submitData)}>
        <MainSection>
          <SecondSection>
            <FirstSection>New Lane Name</FirstSection>
            <Input
              placeholder="Enter Name"
              {...register("statusLane", {
                required: "Lane Status is required",
              })}
              onChange={(e: any) => {
                const capitalizedValue = e?.target.value;
                setValue("statusLane", capitalizedValue);
                trigger("statusLane");
              }}
              suffix={<PencilEdit style={{ cursor: "pointer" }} />}
              style={{ width: "252px", background: "#eff1fc", border: "none" }}
            />
            {errors.statusLane ? (
              <span className="text-rose-500 text-left text-sm mt-1 ">
                {errors?.statusLane?.message}
              </span>
            ) : (
              ""
            )}
          </SecondSection>
          <SecondSection>
            <FirstSection>Lane to be Spillover</FirstSection>
            <CheckboxSection>
              <label>
                <input
                  type="radio"
                  value={"Yes"}
                  {...register("isNotSpillOver", {
                    required: "Lane Status is required",
                  })}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  value="No"
                  {...register("isNotSpillOver")}
                />
                No
              </label>
            </CheckboxSection>
            {errors.isNotSpillOver ? (
              <span className="text-rose-500 text-left text-sm mt-1 ">
                {errors?.isNotSpillOver?.message}
              </span>
            ) : (
              ""
            )}
          </SecondSection>
          <SecondSection>
            <FirstSection>Color</FirstSection>
            <CheckboxSection>
              <ColorContainer>
                {laneColorData?.map((item, index) => (
                  <Box1
                    key={index}
                    textColor={item?.color}
                    onClick={() => {
                      handleClick(item?.color, index);
                      setValue("color", item?.color);
                      trigger("color");
                    }}
                  >
                    {bgIndex == index ? (
                      <CheckCircleFilled
                        key={item?.id}
                        style={{ color: "#fff", fontSize: "15px" }}
                      />
                    ) : null}
                  </Box1>
                ))}
                <input
                  type="hidden"
                  {...register("color", {
                    required: "Color is required",
                    setValueAs: (value) => (value === undefined ? null : value),
                  })}
                />
              </ColorContainer>
              {errors.color && (
                <span className="text-rose-500 text-left text-sm mt-1">
                  {errors?.color?.message}
                </span>
              )}
            </CheckboxSection>
          </SecondSection>
        </MainSection>
        <ButtonWrapper>
          <ModalButton onClick={() => showModal(false)} color={activeColor}>
            Cancel
          </ModalButton>
          <input type="submit" name="Update" />
          {/* <ModalButton type="submit" color={activeColor}>
            Update
          </ModalButton> */}
        </ButtonWrapper>
      </form>
    </Wrapper>
  );
};

export default CreateNewLane;
