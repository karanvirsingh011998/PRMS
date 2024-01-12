import styled from "styled-components";
import { TabProps } from "constants/themes";
interface IProps {
  backgroundColor: any;
}
export const Wrapper = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 60px;
`;
export const MainSection = styled.div`
  display: flex;
  gap: 40px;
  flex-direction: column;
`;
export const FirstSection = styled.div`
  font-size: 18px;
  font-weight: 700;
  width: 100%;
  max-width: 224px;
`;
export const ColorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 9px;
`;
export const Box1 = styled.div<{ textColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 50px;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ textColor }) => `${textColor}`};
  :hover {
    opacity: 0.5;
  }
`;
export const SecondSection = styled.div<{ alignItem?: boolean }>`
  display: flex;
  align-items: ${({ alignItem }) => (alignItem == false ? "" : "center")};

  gap: 50px;
  .ant-input-affix-wrapper-focused {
    border-color: none;
    box-shadow: none;
  }
  input.ant-input {
    color: #000;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }
  Input {
    background: #eff1fc;
    height: 38px;
  }
`;
export const ModalButton = styled.div<TabProps>`
  max-width: 134px;
  width: 100%;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 400;
  padding: 5px;
  background-color: #687ff4;
  border: 1px solid #5d73e280;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  cursor: pointer;

  justify-content: center;
  color: white;
  min-height: 35px;
  margin-top: 2px;
  svg {
    margin-right: 3px;
    margin-bottom: 2px;
  }
  margin-top: 2px;
  @media (max-width: 1280px) {
    min-height: 10px;
  }
`;
export const CheckboxSection = styled.div`
  width: 100%;
  max-width: 572px;
  display: flex;
  font-weight: 800;
  input {
    height: 18px;
  }
`;
export const ButtonWrapper = styled.div`
  width: 100%;

  gap: 10px;
  justify-content: flex-end;

  display: flex;
`;
export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 95px;
  position: relative;
  img {
    width: 17px;
    height: 14px;
    position: absolute;
    right: 10px;
    top: 40px;
  }
`;
export const LaneTableWrapper = styled.div`
  width: 100%;
  overflow: auto;
  max-height: 500px;
  .ant-table {
    filter: none;
  }
  .disabled-row {
    pointer-events: none;
    background-color: #f0f0f0;
    color: #999;
  }

  .ant-table-wrapper .ant-table-thead > tr > th {
    background-color: #f3f5ff;
  }
  .ant-table-tbody > tr > td {
    padding: 10px 16px;
  }
`;

// COLOR PALAETTE
export const ColorPaletteWrapper = styled.div`
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
`;
export const ColorBox = styled.div<{ textColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 3px;
  cursor: pointer;
  background: ${({ textColor }) => `${textColor}`};
  :hover {
    opacity: 0.5;
  }
`;

export const EditInputWrapper = styled.div`
  .ant-input:focus {
    border: 1px solid #b4bff2;
    box-shadow: none;
  }
  input.ant-input {
    color: #000;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }
  Input {
    background: #eff1fc;
    /* height: 38px; */
    border-radius: 4px;
    border: none;
  }
`;

export const ColorLaneNames = styled.div<IProps>`
  background: ${(props) => props.backgroundColor};
  color: #fff;
  padding: 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
`;
