import styled from "styled-components";
import PropTypes from "prop-types";
import "./Answer.css";
import { useState } from "react";
import { useQuizStore } from "../../../store/quizStore";

/* border: 2px solid #BF4F74;*/
// padding: 0.25em 1em;
// const Button = styled.button($primary = false)`
//   background: transparent;
// //   color: #BF4F74;
//   margin: 1em;
//   width: 100%;
//   font-size: ${$primary ? "16px" : "18px"};
//   border: 1px solid #c40094;
//   padding: 10px 20px;
//   border-radius: 5px;
//   cursor: pointer;
// `

const OptionBox = ({
  uuid = undefined,
  text = "Answer",
  correct = false,
  lock = true,
}) => {
  const {
    storedQuestion,
    updateSelectedOptions,
    selectedOptions,
    addOption,
    removeOption,
  } = useQuizStore();
  const [selected, setSelected] = useState(false);
  const getOptionClassName = () => {
    const isSelected = selectedOptions?.includes(uuid) ? true : false;
    // const isSelected = false;

    if (lock) {
      if (isSelected) return correct ? "correct" : "wrong";
      else if (correct) return "correct";
      else return "";
    } else if (isSelected) return "selected";
    else return "";
  };
  return (
    <>
      <div
        className={`options ${getOptionClassName()}`}
        onClick={() => {
          if (storedQuestion?.type === "single") {
            updateSelectedOptions([uuid]);
          } else {
            const isSelected = selectedOptions?.includes(uuid) ? true : false;
            if (isSelected) removeOption(uuid);
            else addOption(uuid);
          }

          if (!lock) setSelected(!selected);
        }}
        // {...props}
      >
        {text}
      </div>
    </>
  );
};

// Setting default values for the props of OptionBox
OptionBox.defaultProps = {
  uuid: undefined,
  text: "",
  correct: false,
  lock: false,
};

// Typechecking props for the OptionBox
OptionBox.propTypes = {
  uuid: PropTypes.string,
  text: PropTypes.string,
  correct: PropTypes.bool,
  lock: PropTypes.bool,
  // type: PropTypes.objectOf(PropTypes.array).isRequired,
};

const Container = styled.div`
  text-align: center;
`;

const answerClick = (e) => {
  console.log("clicked answer");
};

export const Option = ({
  uuid = undefined,
  text = "Answer",
  correct = false,
  lock = false,
}) => {
  return (
    <Container onClick={answerClick}>
      <OptionBox uuid={uuid} lock={lock} text={text} correct={correct} />
    </Container>
  );
};

Option.defaultProps = {
  uuid: undefined,
  text: "",
  correct: false,
  lock: false,
};

Option.propTypes = {
  uuid: PropTypes.string,
  text: PropTypes.string,
  correct: PropTypes.bool,
  lock: PropTypes.bool,
};
