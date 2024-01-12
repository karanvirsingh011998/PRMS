import { CheckCircleFilled } from "@ant-design/icons";
import { laneColorData } from "components/Modal/data";
import React, { useState } from "react";
import { ColorBox, ColorPaletteWrapper } from "styles/components/CreateNewLane";

const ColorPalette = ({ setEditedColor, disable, selectedColor }: any) => {
  const [backgroundColor, setBgColor] = useState("");

  const handleClick = (color: string, id: number) => {
    setBgColor(color);
    setBgIndex(id);
    // setEditedColor(color);
  };
  const [bgIndex, setBgIndex] = useState(-1);

  return (
    <>
      <ColorPaletteWrapper>
        {laneColorData.map((item: any, index: any) => (
          <ColorBox
            key={index}
            textColor={item?.color}
            onClick={() => !disable && handleClick(item?.color, index)}
          >
            {bgIndex == index ? (
              <CheckCircleFilled
                key={item?.id}
                style={{ color: "#fff", fontSize: "8px" }}
              />
            ) : null}
          </ColorBox>
        ))}
      </ColorPaletteWrapper>
    </>
  );
};

export default ColorPalette;
